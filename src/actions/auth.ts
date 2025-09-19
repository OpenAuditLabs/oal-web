'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { validateRegistration } from '@/lib/validation'
import { validateLogin } from '@/lib/validation'
import { signJwt } from '@/lib/jwt'
import { createHash } from 'crypto'
import { cookies } from 'next/headers'

export type RegisterResult = {
  errors?: {
    name?: string
    email?: string
    password?: string
    form?: string
  }
  success?: string
}

// Server action compatible with useActionState(prevState, formData)
export async function registerUserAction(_prevState: RegisterResult, formData: FormData): Promise<RegisterResult> {
  try {
  const name = String(formData.get('name') ?? '').trim()
  const emailRaw = String(formData.get('email') ?? '').trim()
  const email = emailRaw.toLowerCase()
  const password = String(formData.get('password') ?? '')

    // Validate input
  const validation = validateRegistration({ name, email, password })
    if (!validation.success) {
      return { errors: validation.errors }
    }

    // Check for existing user
  const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      // Timing mitigation: compare with dummy hash
      const DUMMY_HASH = bcrypt.hashSync('dummy-password', 10)
      await bcrypt.compare(password, DUMMY_HASH);
      return { errors: { email: 'Email already in use' } }
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10)

    // Create user and initial credit in a transaction
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email, // ensure stored as lowercase
          name,
          password: hashed,
        }
      })

      await tx.credit.create({
        data: {
          userId: user.id,
          balance: 0,
        }
      })
    })

    return { success: 'Registration successful' }
  } catch (err: unknown) {
    console.error('registerUserAction error:', err)
    // Handle Prisma unique constraint just in case of race
    const message = err instanceof Error ? err.message : 'Registration failed'
    if (message.includes('Unique constraint') || message.includes('users_email_key')) {
      return { errors: { email: 'Email already in use' } }
    }
    return { errors: { form: 'Something went wrong. Please try again.' } }
  }
}

export type LoginResult = {
  errors?: {
    email?: string
    password?: string
    form?: string
  }
  success?: string
}

// Server action for logging in a user (credential verification only; no session yet)
export async function loginUserAction(_prevState: LoginResult, formData: FormData): Promise<LoginResult> {
  try {
  const emailRaw = String(formData.get('email') ?? '').trim()
  const email = emailRaw.toLowerCase()
  const password = String(formData.get('password') ?? '')

  const validation = validateLogin({ email, password })
    if (!validation.success) {
      return { errors: validation.errors }
    }

  const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) {
      const DUMMY_HASH = bcrypt.hashSync('dummy-password', 10)
      await bcrypt.compare(password, DUMMY_HASH);
      // Do not reveal which field failed
      return { errors: { form: 'Invalid email or password' } }
    }
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return { errors: { form: 'Invalid email or password' } }
    }

    // Issue JWT and set cookie
    const token = await signJwt({ sub: user.id, email: user.email })

    // Persist SHA-256 hash of latest JWT to the user record (not the raw token)
    try {
      const hash = createHash('sha256').update(token).digest('hex');
      await prisma.user.update({
        where: { id: user.id },
        data: { jwt_hash: hash },
      })
    } catch (e) {
      console.warn('Failed to save JWT hash to user record', e)
    }
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      // 7 days expiry (should align with token exp)
      maxAge: 7 * 24 * 60 * 60,
    })

    return { success: 'Login successful' }
  } catch (err) {
    console.error('loginUserAction error:', err)
    return { errors: { form: 'Login failed. Please try again.' } }
  }
}

// Simple result type for logout
export type LogoutResult = { success?: string; error?: string }

export async function logoutUserAction(): Promise<LogoutResult> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    if (token) {
      // Hash token to attempt clearing jwt_hash (best effort)
      try {
        const hash = createHash('sha256').update(token).digest('hex')
        // Clear jwt_hash only if it matches to avoid overwriting concurrent sessions (if any)
        await prisma.user.updateMany({
          where: { jwt_hash: hash },
          data: { jwt_hash: null },
        })
      } catch (e) {
        console.warn('Failed to clear jwt_hash during logout', e)
      }
    }
    // Expire cookie
    cookieStore.set('auth_token', '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    })
    return { success: 'Logged out' }
  } catch (e) {
    console.error('logoutUserAction error:', e)
    return { error: 'Logout failed' }
  }
}

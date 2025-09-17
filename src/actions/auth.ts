'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { validateRegistration } from '@/lib/validation'

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
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    // Validate input
    const validation = validateRegistration({ name, email, password })
    if (!validation.success) {
      return { errors: validation.errors }
    }

    // Check for existing user
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return { errors: { email: 'Email already in use' } }
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10)

    // Create user and initial credit in a transaction
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
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

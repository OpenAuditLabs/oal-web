import 'server-only'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import type { IronSession, SessionOptions } from 'iron-session'

// Shape of what we store in the session cookie
export type SessionData = {
  user?: {
    id: string
    email: string
    name?: string | null
  }
}

// Ensure we always have a strong password in production
function resolvePassword(): string {
  const pwd = process.env.IRON_SESSION_PASSWORD
  if (process.env.NODE_ENV === 'production') {
    if (!pwd || pwd.length < 32) {
      throw new Error('IRON_SESSION_PASSWORD must be set and at least 32 characters in production')
    }
    return pwd
  }
  return pwd && pwd.length >= 32 ? pwd : 'dev-only-password-must-be-32-chars-minimum-123456'
}

export const sessionOptions: SessionOptions = {
  password: resolvePassword(),
  cookieName: 'oal_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  },
}

// Get the iron-session instance bound to Next.js App Router cookies()
export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, sessionOptions)
}

// Helper: require an authenticated user in session
export async function requireSessionUser(): Promise<{ session: IronSession<SessionData>; user: NonNullable<SessionData['user']> }> {
  const session = await getSession()
  if (!session.user) {
    throw new Error('Not authenticated')
  }
  return { session, user: session.user }
}

// Helper: set the session user and persist
export async function setSessionUser(user: SessionData['user']): Promise<void> {
  const session = await getSession()
  session.user = user || undefined
  await session.save()
}

// Helper: destroy the session
export async function destroySession(): Promise<void> {
  const session = await getSession()
  await session.destroy()
}

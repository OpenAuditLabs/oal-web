import 'server-only'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import type { IronSession, SessionOptions } from 'iron-session'
import { IRON_SESSION_PASSWORD } from '@/lib/env'
import { IS_PRODUCTION, cookieName } from '@/lib/constants'


export type SessionData = {
  user?: {
    id: string
  }
}

export const sessionOptions: SessionOptions = {
  password: IRON_SESSION_PASSWORD,
  cookieName: cookieName,
  cookieOptions: {
    secure: IS_PRODUCTION,
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

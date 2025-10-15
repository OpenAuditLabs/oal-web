import 'server-only'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import type { IronSession, SessionOptions } from 'iron-session'
import { IRON_SESSION_PASSWORD } from '@/lib/env'
import { IS_PRODUCTION, cookieName } from '@/lib/constants'


/**
 * The shape of the data stored in the session.
 */
export type SessionData = {
  user?: {
    id: string
  }
}

/**
 * Represents the authenticated session object, extending IronSession with user data.
 */
export interface Session extends IronSession<SessionData> {
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

/**
 * Retrieves the iron-session instance bound to Next.js App Router cookies().
 * @returns A Promise that resolves to the Session object.
 */
export async function getSession(): Promise<Session> {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, sessionOptions)
}

/**
 * Helper: require an authenticated user in session.
 * Throws an error if no user is authenticated.
 * @returns A Promise that resolves to an object containing the session and the authenticated user.
 */
export async function requireSessionUser(): Promise<{ session: Session; user: NonNullable<SessionData['user']> }> {
  const session = await getSession()
  if (!session.user) {
    throw new Error('Not authenticated')
  }
  return { session, user: session.user }
}

/**
 * Helper: set the session user and persist the session.
 * @param user The user data to set in the session.
 * @returns A Promise that resolves when the session is saved.
 */
export async function setSessionUser(user: SessionData['user']): Promise<void> {
  const session = await getSession()
  session.user = user || undefined
  await session.save()
}

/**
 * Helper: destroy the session.
 * @returns A Promise that resolves when the session is destroyed.
 */
export async function destroySession(): Promise<void> {
  const session = await getSession()
  await session.destroy()
}

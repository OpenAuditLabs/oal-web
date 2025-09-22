import 'server-only'

import { getSession } from '@/lib/session'
import { Result, success } from '@/lib/result'

export type SignoutResult = { ok: true }

export async function signout(): Promise<Result<SignoutResult>> {
  const session = await getSession()
  await session.destroy()
  return success({ ok: true })
}

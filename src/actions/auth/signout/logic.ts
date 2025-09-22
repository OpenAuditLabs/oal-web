import 'server-only'

import { getSession } from '@/lib/session'
import { Result, success } from '@/lib/result'

export type SignoutResult = { ok: true }

export async function signout(): Promise<Result<undefined>> {
  const session = await getSession();
  session.destroy();
  return success(undefined);
}

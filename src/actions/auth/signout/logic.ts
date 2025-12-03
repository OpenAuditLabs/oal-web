import 'server-only'

import { destroySession } from '@/lib/session'
import { Result, success } from '@/lib/result'

export async function signout(): Promise<Result<undefined>> {
  await destroySession();
  return success(undefined);
}

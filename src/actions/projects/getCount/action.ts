'use server'

import { getProjectCountForUser } from './logic'
import { unwrapResult } from '@/lib/action-unwrap'

export async function getProjectCountAction(userId: string, timeframe: string) {
  return unwrapResult(await getProjectCountForUser(userId, timeframe))
}

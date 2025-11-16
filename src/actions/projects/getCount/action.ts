'use server'

import { getProjectCountForUser } from './logic'
import { unwrapResult } from '@/lib/action-unwrap'

export async function getProjectCountAction(userId: string, timeframe: string) {
  const currentCount = unwrapResult(await getProjectCountForUser(userId, timeframe, 0))
  const previousCount = unwrapResult(await getProjectCountForUser(userId, timeframe, 1))
  return { current: currentCount, previous: previousCount }
}

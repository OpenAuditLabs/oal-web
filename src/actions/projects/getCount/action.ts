'use server'

import { getProjectCountForUser } from './logic'
import { unwrapNumber } from '@/lib/action-unwrap'

export async function getProjectCountAction(userId: string, timeframe: string) {
  const currentCount = unwrapNumber(await getProjectCountForUser(userId, timeframe, 0))
  const previousCount = unwrapNumber(await getProjectCountForUser(userId, timeframe, 1))
  return { current: currentCount, previous: previousCount }
}

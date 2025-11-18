'use server'

import { getCompletedAuditCountForUser } from './logic'
import { unwrapNumber } from '@/lib/action-unwrap'

export async function getCompletedAuditCountAction(userId: string, timeframe: string) {
  const currentCount = unwrapNumber(await getCompletedAuditCountForUser(userId, timeframe, 0))
  const previousCount = unwrapNumber(await getCompletedAuditCountForUser(userId, timeframe, 1))
  return { current: currentCount, previous: previousCount }
}

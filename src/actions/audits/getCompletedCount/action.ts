'use server'

import { getCompletedAuditCountForUser } from './logic'
import { unwrapNumber } from '@/lib/action-unwrap'

export async function getCompletedAuditCountAction(
  userId: string,
  timeframe: string,
  startDate?: Date,
  endDate?: Date,
) {
  const currentCount = unwrapNumber(await getCompletedAuditCountForUser(userId, timeframe, 0, startDate, endDate))
  const previousCount = unwrapNumber(await getCompletedAuditCountForUser(userId, timeframe, 1, startDate, endDate))
  return { current: currentCount, previous: previousCount }
}

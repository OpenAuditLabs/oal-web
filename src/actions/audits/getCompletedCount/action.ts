'use server'

import { getCompletedAuditCountForUser } from './logic'
import { unwrapResult } from '@/lib/action-unwrap'

export async function getCompletedAuditCountAction(userId: string, timeframe: string) {
  const currentCount = unwrapResult(await getCompletedAuditCountForUser(userId, timeframe, 0))
  const previousCount = unwrapResult(await getCompletedAuditCountForUser(userId, timeframe, 1))
  return { current: currentCount, previous: previousCount }
}

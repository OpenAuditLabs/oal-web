'use server'

import { getRunningAuditCountForUser } from './logic'
import { unwrapResult } from '@/lib/action-unwrap'

export async function getRunningAuditCountAction(userId: string, timeframe: string) {
  const currentCount = unwrapResult(await getRunningAuditCountForUser(userId, timeframe, 0))
  const previousCount = unwrapResult(await getRunningAuditCountForUser(userId, timeframe, 1))
  return { current: currentCount, previous: previousCount }
}

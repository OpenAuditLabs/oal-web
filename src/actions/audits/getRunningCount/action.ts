'use server'

import { getRunningAuditCountForUser } from './logic'
import { unwrapNumber } from '@/lib/action-unwrap'

export async function getRunningAuditCountAction(userId: string, timeframe: string) {
  const currentCount = unwrapNumber(await getRunningAuditCountForUser(userId, timeframe, 0))
  const previousCount = unwrapNumber(await getRunningAuditCountForUser(userId, timeframe, 1))
  return { current: currentCount, previous: previousCount }
}

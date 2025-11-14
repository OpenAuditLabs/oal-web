'use server'

import { getCompletedAuditCountForUser } from './logic'
import { unwrapResult } from '@/lib/action-unwrap'

export async function getCompletedAuditCountAction(userId: string, timeframe: string) {
  return unwrapResult(await getCompletedAuditCountForUser(userId, timeframe))
}

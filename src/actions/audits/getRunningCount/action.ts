'use server'

import { getRunningAuditCountForUser } from './logic'
import { unwrapResult } from '@/lib/action-unwrap'

export async function getRunningAuditCountAction(userId: string, timeframe: string) {
  return unwrapResult(await getRunningAuditCountForUser(userId, timeframe))
}

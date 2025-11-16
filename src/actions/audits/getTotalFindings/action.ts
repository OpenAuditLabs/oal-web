'use server'

import { getTotalFindingsLogic } from './logic'
import { unwrapResult } from '@/lib/action-unwrap'

export async function getTotalFindingsAction(userId: string, timeframe: string) {
  const currentCount = unwrapResult(await getTotalFindingsLogic(userId, timeframe, 0))
  const previousCount = unwrapResult(await getTotalFindingsLogic(userId, timeframe, 1))
  return { current: currentCount, previous: previousCount }
}

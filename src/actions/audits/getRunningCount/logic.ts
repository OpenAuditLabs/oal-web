import 'server-only'

import { prisma } from '@/lib/prisma'
import { Result, success, error } from '@/lib/result'
import { AuditStatus } from '@prisma/client'
import { getTimeframeFilter } from '@/lib/timeframe'

/**
 * Retrieves the count of running audits for a specific user.
 *
 * @param userId The ID of the user.
 * @returns A Result object containing the count of running audits, or an error if the operation fails.
 */
export async function getRunningAuditCountForUser(userId: string, timeframe: string): Promise<Result<number>> {
  if (!userId) {
    return error('User ID cannot be empty.')
  }

  const createdAtFilter = getTimeframeFilter(timeframe)

  try {
    const count = await prisma.audit.count({
      where: {
        status: AuditStatus.RUNNING,
        project: { ownerId: userId },
        ...createdAtFilter
      },
    })
    return success(count)
  } catch (e) {
    console.error('Failed to retrieve running audit count:', e)
    return error(`Failed to retrieve running audit count for user ${userId}.`)
  }
}

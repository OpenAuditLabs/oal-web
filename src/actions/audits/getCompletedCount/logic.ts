import 'server-only'

import { prisma } from '@/lib/prisma'
import { Result, success, error } from '@/lib/result'
import { AuditStatus } from '@prisma/client'
import { getTimeframeFilter } from '@/lib/timeframe'

/**
 * Retrieves the count of completed audits for a specific user.
 *
 * @param userId The ID of the user.
 * @returns A Result object containing the count of completed audits, or an error if the operation fails.
 */
export async function getCompletedAuditCountForUser(userId: string, timeframe: string): Promise<Result<number>> {
  if (!userId) {
    return error('User ID cannot be empty.')
  }

  const createdAtFilter = getTimeframeFilter(timeframe)

  try {
    const count = await prisma.audit.count({
      where: {
        status: AuditStatus.COMPLETED,
        project: { ownerId: userId },
        ...createdAtFilter
      },
    })
    return success(count)
  } catch (e) {
    console.error('Failed to retrieve completed audit count:', e)
    return error(`Failed to retrieve completed audit count for user ${userId}.`)
  }
}

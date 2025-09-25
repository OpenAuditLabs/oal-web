import 'server-only'

import { prisma } from '@/lib/prisma'
import { Result, success, error } from '@/lib/result'
import { AuditStatus } from '@prisma/client'

export async function getCompletedAuditCountForUser(userId: string): Promise<Result<number>> {
  try {
    const count = await prisma.audit.count({
      where: {
        status: AuditStatus.COMPLETED,
        project: { ownerId: userId },
      },
    })
    return success(count)
  } catch (err) {
    console.error('Completed audit count error:', err, { userId })
    return error('Failed to fetch completed audit count')
  }
}

import 'server-only'

import { prisma } from '@/lib/prisma'
import { Result, success, error } from '@/lib/result'
import { AuditStatus } from '@prisma/client'

export async function getRunningAuditCountForUser(userId: string): Promise<Result<number>> {
  try {
    const count = await prisma.audit.count({
      where: {
        status: AuditStatus.RUNNING,
        project: { ownerId: userId },
      },
    })
    return success(count)
  } catch (err) {
    console.error('Running audit count error:', err, { userId })
    return error('Failed to fetch running audit count')
  }
}

import 'server-only'

import { prisma } from '@/lib/prisma'
import { Result, success } from '@/lib/result'
import { AuditStatus } from '@prisma/client'

export async function getCompletedAuditCountForUser(userId: string): Promise<Result<number>> {
  const count = await prisma.audit.count({
    where: {
      status: AuditStatus.COMPLETED,
      project: { ownerId: userId },
    },
  })
  return success(count)
}

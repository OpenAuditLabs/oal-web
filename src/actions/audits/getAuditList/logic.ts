import 'server-only'

import { prisma } from '@/lib/prisma'
import { Result, success } from '@/lib/result'
import type { Prisma } from '@prisma/client'

export type AuditWithProject = Prisma.AuditGetPayload<{ include: { project: true } }>

export async function getAuditsForUser(userId: string): Promise<Result<AuditWithProject[]>> {
  // Return all audits that belong to projects owned by the given user
  const audits = await prisma.audit.findMany({
    where: {
      project: { is: { ownerId: userId } },
    },
    include: {
      project: true,
    },
  })
  return success(audits)
}

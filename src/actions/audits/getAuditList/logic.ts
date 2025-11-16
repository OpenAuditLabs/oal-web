import 'server-only'

import { prisma } from '@/lib/prisma'
import { Result, success } from '@/lib/result'
import type { Prisma } from '@prisma/client'

export type AuditWithProject = Prisma.AuditGetPayload<{ include: { project: true } }>

export interface PaginationMetaData {
  totalItems: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export interface PaginatedAudits {
  audits: AuditWithProject[]
  pagination: PaginationMetaData
}

export async function getAuditsForUser(
  userId: string,
  page: number = 1,
  pageSize: number = 10,
): Promise<Result<PaginatedAudits>> {
  const skip = (page - 1) * pageSize

  const totalItems = await prisma.audit.count({
    where: {
      project: { is: { ownerId: userId } },
    },
  })

  const audits = await prisma.audit.findMany({
    where: {
      project: { is: { ownerId: userId } },
    },
    include: {
      project: true,
    },
    skip,
    take: pageSize,
  })

  const totalPages = Math.ceil(totalItems / pageSize)

  return success({
    audits,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
      pageSize,
    },
  })
}

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
  const normalizedPage = Math.max(1, Math.floor(Number(page) || 1))
  const normalizedPageSize = Math.min(100, Math.max(1, Math.floor(Number(pageSize) || 10)))

  const skip = (normalizedPage - 1) * normalizedPageSize

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
    take: normalizedPageSize,
  })

  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / normalizedPageSize)

  return success({
    audits,
    pagination: {
      totalItems,
      totalPages,
      currentPage: normalizedPage,
      pageSize: normalizedPageSize,
    },
  })
}

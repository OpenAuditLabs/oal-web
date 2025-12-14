import 'server-only'

import { prisma } from '@/lib/prisma'
import { Result, success, error } from '@/lib/result' // Import 'error'
import type { Prisma } from '@prisma/client'
import { getTimeframeFilter } from '@/lib/timeframe' // Import getTimeframeFilter

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

export type Timeframe = '30d' | '7d' | '24h'

export async function getAuditsForUser(
  userId: string,
  page: number = 1,
  pageSize: number = 10,
  startDate?: Date,
  endDate?: Date,
  timeframe?: Timeframe,
): Promise<Result<PaginatedAudits, string>> {
  const normalizedPage = Math.max(1, Math.floor(Number(page) || 1))
  const normalizedPageSize = Math.min(100, Math.max(1, Math.floor(Number(pageSize) || 10)))

  const skip = (normalizedPage - 1) * normalizedPageSize

  // Validate date range: startDate must not be after endDate
  if (startDate && endDate && startDate > endDate) {
    return err('startDate cannot be after endDate')
  }

  const baseWhereClause: Prisma.AuditWhereInput = {
    project: { is: { ownerId: userId } },
  }

  let dateFilter: Prisma.DateTimeFilter | undefined

  // Handle date range (startDate and endDate)
  if (startDate || endDate) {
    dateFilter = {}
    if (startDate) {
      dateFilter.gte = startDate
    }
    if (endDate) {
      dateFilter.lte = endDate
    }
  }

  // Handle timeframe filter
  let timeframeFilter: Prisma.DateTimeFilter | undefined
  if (timeframe) {
    const tf = getTimeframeFilter(timeframe)
    if (tf.createdAt) {
      timeframeFilter = tf.createdAt as Prisma.DateTimeFilter
    }
  }

  // Combine date range and timeframe filters using AND
  const combinedDateFilter: Prisma.DateTimeFilter[] = []
  if (dateFilter) {
    combinedDateFilter.push(dateFilter)
  }
  if (timeframeFilter) {
    combinedDateFilter.push(timeframeFilter)
  }

  const finalWhereClause: Prisma.AuditWhereInput = {
    ...baseWhereClause,
    ...(combinedDateFilter.length > 0 && { AND: combinedDateFilter.map(filter => ({ createdAt: filter })) }),
  }

  const totalItems = await prisma.audit.count({
    where: finalWhereClause,
  })

  const audits = await prisma.audit.findMany({
    where: finalWhereClause,
    include: {
      project: true,
    },
    orderBy: [
      { createdAt: 'desc' },
      { id: 'asc' },
    ],
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

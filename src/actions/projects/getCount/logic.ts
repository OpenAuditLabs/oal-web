import 'server-only'

import { prisma } from '@/lib/prisma'
import { Result, success } from '@/lib/result'
import { addDays } from 'date-fns'

export async function getProjectCountForUser(userId: string, timeframe: string): Promise<Result<number>> {
  let createdAtFilter = {}

  if (timeframe === '30d') {
    createdAtFilter = { gte: addDays(new Date(), -30) }
  } else if (timeframe === '7d') {
    createdAtFilter = { gte: addDays(new Date(), -7) }
  } else if (timeframe === '24h') {
    createdAtFilter = { gte: addDays(new Date(), -1) }
  }

  const count = await prisma.project.count({ where: { ownerId: userId, ...createdAtFilter } })
  return success(count)
}

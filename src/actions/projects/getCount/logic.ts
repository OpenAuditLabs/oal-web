import 'server-only'

import { prisma } from '@/lib/prisma'
import { Result, success } from '@/lib/result'
import { getTimeframeFilter } from '@/lib/timeframe'

export async function getProjectCountForUser(userId: string, timeframe: string, offset: number = 0): Promise<Result<number>> {
  const createdAtFilter = getTimeframeFilter(timeframe, offset)

  const count = await prisma.project.count({ where: { ownerId: userId, ...createdAtFilter } })
  return success(count)
}

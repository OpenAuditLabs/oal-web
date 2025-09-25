import 'server-only'

import { prisma } from '@/lib/prisma'
import { Result, success } from '@/lib/result'

export async function getProjectCountForUser(userId: string): Promise<Result<number>> {
  const count = await prisma.project.count({ where: { ownerId: userId } })
  return success(count)
}

import 'server-only'

import { prisma } from '@/lib/prisma'
import { Result, success, error } from '@/lib/result'

export async function getProjectCountForUser(userId: string): Promise<Result<number>> {
  try {
    const count = await prisma.project.count({ where: { ownerId: userId } })
    return success(count)
  } catch (err) {
    console.error('Project count error:', err, { userId })
    return error('Failed to fetch project count')
  }
}

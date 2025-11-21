import 'server-only'

import { prisma } from '@/lib/prisma'
import { Result, success } from '@/lib/result'
import { getTimeframeFilter } from '@/lib/timeframe'

// Simple in-memory cache for project counts within a request cycle
const projectCountCache = new Map<string, number>();

export const clearProjectCountCache = () => {
  projectCountCache.clear();
};

export async function getProjectCountForUser(
  userId: string,
  timeframe: string,
  offset: number = 0,
  bypassCache: boolean = false
): Promise<Result<number>> {
  const cacheKey = `${userId}-${timeframe}-${offset}`;

  if (!bypassCache && projectCountCache.has(cacheKey)) {
    return success(projectCountCache.get(cacheKey)!);
  }

  const createdAtFilter = getTimeframeFilter(timeframe, offset);

  const count = await prisma.project.count({ where: { ownerId: userId, ...createdAtFilter } });
  projectCountCache.set(cacheKey, count); // Cache the result
  return success(count);
}

import { getProjectCountForUser } from './logic';
import { prisma } from '@/lib/prisma';
import { success } from '@/lib/result';

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    project: {
      count: jest.fn(),
    },
  },
}));

describe('getProjectCountForUser', () => {
  const mockPrismaCount = prisma.project.count as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the cache before each test to ensure isolation
    // This is a bit hacky, but necessary for testing the in-memory cache
    // In a real application, the cache would likely be cleared per request or have a TTL
    (getProjectCountForUser as any).projectCountCache = new Map<string, number>();
  });

  it('should cache the result and avoid duplicate prisma calls', async () => {
    mockPrismaCount.mockResolvedValue(10);

    const userId = 'user123';
    const timeframe = 'month';
    const offset = 0;

    // First call - should hit prisma
    const result1 = await getProjectCountForUser(userId, timeframe, offset);
    expect(result1).toEqual(success(10));
    expect(mockPrismaCount).toHaveBeenCalledTimes(1);

    // Second call with same arguments - should hit cache
    const result2 = await getProjectCountForUser(userId, timeframe, offset);
    expect(result2).toEqual(success(10));
    expect(mockPrismaCount).toHaveBeenCalledTimes(1); // Still 1 call
  });

  it('should bypass the cache when bypassCache is true', async () => {
    mockPrismaCount.mockResolvedValueOnce(5).mockResolvedValueOnce(15);

    const userId = 'user123';
    const timeframe = 'month';
    const offset = 0;

    // First call - should hit prisma and cache 5
    const result1 = await getProjectCountForUser(userId, timeframe, offset);
    expect(result1).toEqual(success(5));
    expect(mockPrismaCount).toHaveBeenCalledTimes(1);

    // Second call with bypassCache true - should hit prisma again and cache 15
    const result2 = await getProjectCountForUser(userId, timeframe, offset, true);
    expect(result2).toEqual(success(15));
    expect(mockPrismaCount).toHaveBeenCalledTimes(2); // Now 2 calls

    // Third call with same arguments, no bypass - should hit cache and return 15
    const result3 = await getProjectCountForUser(userId, timeframe, offset);
    expect(result3).toEqual(success(15));
    expect(mockPrismaCount).toHaveBeenCalledTimes(2); // Still 2 calls
  });

  it('should return different results for different arguments', async () => {
    mockPrismaCount.mockImplementation((args) => {
      if (args.where.ownerId === 'user123' && args.where.createdAt.gte === '2025-10-01T00:00:00.000Z') {
        return 10;
      }
      return 20;
    });

    const userId1 = 'user123';
    const timeframe1 = 'month';
    const offset1 = 0;

    const userId2 = 'user456';
    const timeframe2 = 'month';
    const offset2 = 0;

    const result1 = await getProjectCountForUser(userId1, timeframe1, offset1);
    expect(result1).toEqual(success(10));
    expect(mockPrismaCount).toHaveBeenCalledTimes(1);

    const result2 = await getProjectCountForUser(userId2, timeframe2, offset2);
    expect(result2).toEqual(success(20));
    expect(mockPrismaCount).toHaveBeenCalledTimes(2);
  });
});
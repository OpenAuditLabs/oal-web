import { getAuditsForUser, PaginatedAudits, Timeframe } from './logic';
import { prisma } from '@/lib/prisma';
import { addDays, subDays, addHours, subHours, startOfDay, endOfDay } from 'date-fns';

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    audit: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

// Mock getTimeframeFilter
jest.mock('@/lib/timeframe', () => ({
  getTimeframeFilter: jest.fn((timeframe: Timeframe) => {
    const now = new Date();
    let gte: Date;
    let lt: Date;

    switch (timeframe) {
      case '30d':
        gte = subDays(now, 30);
        lt = now;
        break;
      case '7d':
        gte = subDays(now, 7);
        lt = now;
        break;
      case '24h':
        gte = subHours(now, 24);
        lt = now;
        break;
      default:
        return {};
    }
    return { createdAt: { gte, lt } };
  }),
}));

const mockAudits = [
  { id: '1', createdAt: subDays(new Date(), 5), project: { id: 'p1', ownerId: 'user1' } },
  { id: '2', createdAt: subDays(new Date(), 10), project: { id: 'p1', ownerId: 'user1' } },
  { id: '3', createdAt: subDays(new Date(), 15), project: { id: 'p1', ownerId: 'user1' } },
  { id: '4', createdAt: subDays(new Date(), 20), project: { id: 'p1', ownerId: 'user1' } },
  { id: '5', createdAt: subDays(new Date(), 25), project: { id: 'p1', ownerId: 'user1' } },
  { id: '6', createdAt: subDays(new Date(), 35), project: { id: 'p1', ownerId: 'user1' } },
];

describe('getAuditsForUser', () => {
  const userId = 'user1';

  beforeEach(() => {
    (prisma.audit.count as jest.Mock).mockResolvedValue(mockAudits.length);
    (prisma.audit.findMany as jest.Mock).mockResolvedValue(mockAudits);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if startDate is after endDate', async () => {
    const startDate = addDays(new Date(), 1);
    const endDate = subDays(new Date(), 1);
    const result = await getAuditsForUser(userId, 1, 10, startDate, endDate);

    expect(result.ok).toBe(false);
    expect(result.val).toBe('startDate cannot be after endDate');
  });

  it('should filter by startDate and endDate', async () => {
    const startDate = subDays(new Date(), 12);
    const endDate = subDays(new Date(), 3);
    const result = await getAuditsForUser(userId, 1, 10, startDate, endDate);

    expect(result.ok).toBe(true);
    expect(prisma.audit.count).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        project: { is: { ownerId: userId } },
        AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
      },
    }));
    expect(prisma.audit.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        project: { is: { ownerId: userId } },
        AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
      },
    }));
  });

  it('should filter by timeframe', async () => {
    const timeframe: Timeframe = '7d';
    const now = new Date();
    const gte = subDays(now, 7);
    const lt = now; // Assuming getTimeframeFilter mocks this

    const result = await getAuditsForUser(userId, 1, 10, undefined, undefined, timeframe);

    expect(result.ok).toBe(true);
    expect(prisma.audit.count).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        project: { is: { ownerId: userId } },
        AND: [{ createdAt: { gte: expect.any(Date), lt: expect.any(Date) } }],
      },
    }));
    expect(prisma.audit.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        project: { is: { ownerId: userId } },
        AND: [{ createdAt: { gte: expect.any(Date), lt: expect.any(Date) } }],
      },
    }));
  });

  it('should filter by both startDate/endDate and timeframe', async () => {
    const startDate = subDays(new Date(), 20);
    const endDate = subDays(new Date(), 10);
    const timeframe: Timeframe = '30d';

    const now = new Date();
    const timeframeGte = subDays(now, 30);
    const timeframeLt = now;

    const result = await getAuditsForUser(userId, 1, 10, startDate, endDate, timeframe);

    expect(result.ok).toBe(true);
    expect(prisma.audit.count).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        project: { is: { ownerId: userId } },
        AND: [
          { createdAt: { gte: startDate } },
          { createdAt: { lte: endDate } },
          { createdAt: { gte: expect.any(Date), lt: expect.any(Date) } },
        ],
      },
    }));
    expect(prisma.audit.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        project: { is: { ownerId: userId } },
        AND: [
          { createdAt: { gte: startDate } },
          { createdAt: { lte: endDate } },
          { createdAt: { gte: expect.any(Date), lt: expect.any(Date) } },
        ],
      },
    }));
  });
});

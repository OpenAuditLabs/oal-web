
import { addDays, addHours } from 'date-fns';

export function getTimeframeFilter(timeframe: string) {
  let createdAtFilter: { gte: Date } | undefined;
  const now = new Date();

  switch (timeframe) {
    case '30d':
      createdAtFilter = { gte: addDays(now, -30) };
      break;
    case '7d':
      createdAtFilter = { gte: addDays(now, -7) };
      break;
    case '24h':
      createdAtFilter = { gte: addHours(now, -24) };
      break;
    default:
      createdAtFilter = undefined;
      break;
  }

  return createdAtFilter ? { createdAt: createdAtFilter } : {};
}

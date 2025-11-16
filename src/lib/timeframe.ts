
import { addDays, addHours } from 'date-fns'

export function getTimeframeFilter(timeframe: string, offset: number = 0) {
  let createdAtFilter: { gte: Date; lt: Date } | undefined
  const now = new Date()

  switch (timeframe) {
    case '30d': {
      const periodStart = addDays(now, -30 * (offset + 1))
      const periodEnd = addDays(now, -30 * offset)
      createdAtFilter = { gte: periodStart, lt: periodEnd }
      break
    }
    case '7d': {
      const periodStart = addDays(now, -7 * (offset + 1))
      const periodEnd = addDays(now, -7 * offset)
      createdAtFilter = { gte: periodStart, lt: periodEnd }
      break
    }
    case '24h': {
      const periodStart = addHours(now, -24 * (offset + 1))
      const periodEnd = addHours(now, -24 * offset)
      createdAtFilter = { gte: periodStart, lt: periodEnd }
      break
    }
    default:
      createdAtFilter = undefined
      break
  }

  return createdAtFilter ? { createdAt: createdAtFilter } : {}
}

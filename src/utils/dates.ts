import { DateRange } from '@octotread/models/dateRange'
import { DateStartEnd } from '@octotread/models/dateStartEnd'
import { fromUnixTime, subDays, subWeeks, subMonths, getUnixTime, startOfDay } from 'date-fns'

export function getOldestDateRange(d: DateStartEnd[]) {
  return d.length ? d[d.length - 1] : null
}

export function generateDateStartEnd(dateRange: DateRange, obj?: DateStartEnd) {
  const end = obj ? fromUnixTime(obj.start) : new Date()

  let fn: ((date: Date | number, amount: number) => Date) | null = null
  switch (dateRange) {
    case 'daily':
      fn = subDays
      break
    case 'weekly':
      fn = subWeeks
      break
    case 'monthly':
      fn = subMonths
      break
  }
  const start = fn(end, 1)

  return {
    start: getUnixTime(start),
    end: getUnixTime(end),
  }
}

export function normalizeDateStartEnd(obj: DateStartEnd): DateStartEnd {
  const start = fromUnixTime(obj.start)
  const end = fromUnixTime(obj.end)

  return {
    start: getUnixTime(startOfDay(start)),
    end: getUnixTime(startOfDay(end)),
  }
}

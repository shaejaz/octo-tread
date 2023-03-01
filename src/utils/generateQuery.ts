import { DateStartEnd } from '@octotread/models/dateStartEnd'
import { SearchQueryState } from '@octotread/services/search-query'
import { format, fromUnixTime } from 'date-fns'

export function generateQueryFn(state: SearchQueryState, dateRange: DateStartEnd) {
  const queries = []

  queries.push(state.searchText ?? '')

  state.language.forEach((i) => queries.push(`language:${i.toLowerCase()}`))

  queries.push(state.stars ? `stars:>${state.stars}` : '')
  queries.push(
    `created:${format(fromUnixTime(dateRange.start), 'yyyy-MM-dd')}..${format(
      fromUnixTime(dateRange.end),
      'yyyy-MM-dd',
    )}`,
  )

  state.topics.forEach((i) => queries.push(`topic:${i}`))
  queries.push(state.sort ? `sort:${state.sort}` : '')

  return queries.filter((i) => i !== '').join(' ')
}

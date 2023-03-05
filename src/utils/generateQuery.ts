import { DateStartEnd } from '@octotread/models/dateStartEnd'
import { SearchQueryState } from '@octotread/services/search-query'
import { format, fromUnixTime } from 'date-fns'

export type GenerateQueryState = Pick<
  SearchQueryState,
  'searchText' | 'language' | 'stars' | 'topics' | 'sort'
>

export function generateQueryString(state: GenerateQueryState, dateStartEnd: DateStartEnd) {
  const queries = []

  queries.push(state.searchText ?? '')

  state.language.forEach((i) => queries.push(`language:${i.toLowerCase()}`))

  queries.push(state.stars ? `stars:>${state.stars}` : '')
  queries.push(
    `created:${format(fromUnixTime(dateStartEnd.start), 'yyyy-MM-dd')}..${format(
      fromUnixTime(dateStartEnd.end),
      'yyyy-MM-dd',
    )}`,
  )

  state.topics.forEach((i) => queries.push(`topic:${i}`))
  queries.push(state.sort ? `sort:${state.sort}` : '')

  return queries.filter((i) => i !== '').join(' ')
}

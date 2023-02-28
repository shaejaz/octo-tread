import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {
  format,
  fromUnixTime,
  getUnixTime,
  startOfDay,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns'
import { enhancedGraphQlApi, SearchRepositoryResult } from './api'
import { DateRange } from '@octotread/models/dateRange'
import { DateStartEnd } from '@octotread/models/dateStartEnd'
import { RepositoryGroup } from '@octotread/models/repositoryGroup'

export interface SearchQueryState {
  searchText?: string
  language: string[]
  stars: number
  dateRange: DateRange
  topics: string[] // TODO: convert to list of Topics
  sort: string
  datesToFetch: DateStartEnd[]
  itemsPerPage: number
  repositories: RepositoryGroup[]
}

export type ResetQueryState = Pick<
  SearchQueryState,
  'dateRange' | 'language' | 'searchText' | 'stars' | 'topics' | 'itemsPerPage'
>

export interface ResetQueryPayload {
  state: ResetQueryState
  newDateObj: DateStartEnd
}

const initialState: SearchQueryState = {
  searchText: undefined,
  language: [],
  stars: 20,
  dateRange: 'weekly',
  topics: [],
  sort: 'stars-desc',
  itemsPerPage: 9,
  datesToFetch: [],
  repositories: [],
}

// TODO: Move functions to utils
export function generateDateRangeObj(dateRange: DateRange, obj?: DateStartEnd) {
  const start = obj ? fromUnixTime(obj.start) : new Date()

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
  const end = fn(start, 1)

  // TODO: Fix naming for start and end
  return {
    start: getUnixTime(end),
    end: getUnixTime(start),
  }
}

export function normalizeDateRangeToStartOfDay(obj: DateStartEnd): DateStartEnd {
  const start = fromUnixTime(obj.start)
  const end = fromUnixTime(obj.end)

  return {
    start: getUnixTime(startOfDay(start)),
    end: getUnixTime(startOfDay(end)),
  }
}

export function getOldestDateRange(d: DateStartEnd[]) {
  return d.length ? d[d.length - 1] : null
}

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

export const searchQuerySlice = createSlice({
  name: 'search-query',
  initialState,
  reducers: {
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload
    },
    setLanguage: (state, action: PayloadAction<string[]>) => {
      state.language = action.payload
    },
    setStars: (state, action: PayloadAction<number | undefined>) => {
      state.stars = action.payload ?? 0
    },
    appendDateToFetch: (state, action: PayloadAction<DateStartEnd>) => {
      const d = getOldestDateRange(state.datesToFetch)
      const nd = d ? normalizeDateRangeToStartOfDay(d) : null

      if (
        !nd ||
        state.datesToFetch.findIndex((i) => i.start === nd.start && i.end === nd.end) === -1
      ) {
        state.datesToFetch.push(normalizeDateRangeToStartOfDay(action.payload))
      }
    },
    loadNextDateRange: (state) => {
      const d = getOldestDateRange(state.datesToFetch)
      if (!d) return

      const obj = generateDateRangeObj(state.dateRange, d)

      state.datesToFetch.push(normalizeDateRangeToStartOfDay(obj))
    },
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.repositories = []
      state.dateRange = action.payload

      // TODO: Remove use to `new Date()` in this reducer
      state.datesToFetch = [normalizeDateRangeToStartOfDay(generateDateRangeObj(action.payload))]
    },
    setTopics: (state, action: PayloadAction<string[]>) => {
      state.topics = action.payload
    },
    setSort: (state, action: PayloadAction<string>) => {
      state.sort = action.payload
    },
    // TODO: Possible split this into another slice
    resetQuery: (state, action: PayloadAction<ResetQueryPayload>) => {
      const s = { ...state, ...action.payload.state }

      s.datesToFetch = [normalizeDateRangeToStartOfDay(action.payload.newDateObj)]
      s.repositories = []
      return s
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      enhancedGraphQlApi.endpoints.SearchRepositories.matchFulfilled,
      (state, action) => {
        const d = getOldestDateRange(state.datesToFetch)
        if (!d) return

        if (
          state.repositories.findIndex(
            (r) => r.dateRange.start === d.start && r.dateRange.end === d.end,
          ) === -1
        ) {
          const p = action.payload as never as SearchRepositoryResult

          state.repositories = [
            ...state.repositories,
            {
              dateRange: state.datesToFetch[state.datesToFetch.length - 1],
              repos: p.repositories,
              totalRepos: p.repositoryCount,
            },
          ]
        }
      },
    )
  },
})

export const {
  setSearchText,
  setLanguage,
  setStars,
  setDateRange,
  setTopics,
  loadNextDateRange,
  appendDateToFetch,
  resetQuery,
} = searchQuerySlice.actions

export default searchQuerySlice.reducer

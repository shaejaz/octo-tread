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
import { Repository, searchApi } from './api/search'

export type DateRange = 'daily' | 'weekly' | 'monthly'

export interface DateRangeObj {
  start: number
  end: number
}

export interface RepoGroup {
  dateRange: {
    start: number
    end: number
  }
  repos: Repository[]
  totalRepos: number
}

export interface SearchQueryState {
  searchText: string
  language: string[]
  stars: number
  dateRange: DateRange
  topics: string[]
  sort: string
  datesToFetch: DateRangeObj[]
  itemsPerPage: number
  repositories: RepoGroup[]
}

const initialState: SearchQueryState = {
  searchText: '',
  language: ['Javascript'],
  stars: 20,
  dateRange: 'weekly',
  topics: [],
  sort: 'stars-desc',
  itemsPerPage: 5,
  datesToFetch: [],
  repositories: [],
}

// TODO: Move functions to utils
export function generateDateRangeObj(dateRange: DateRange, obj?: DateRangeObj) {
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

export function normalizedDateRangeToStartOfDay(obj: DateRangeObj): DateRangeObj {
  const start = fromUnixTime(obj.start)
  const end = fromUnixTime(obj.end)

  return {
    start: getUnixTime(startOfDay(start)),
    end: getUnixTime(startOfDay(end)),
  }
}

export function getOldestDateRange(d: DateRangeObj[]) {
  return d.length ? d[d.length - 1] : null
}

export function generateQueryFn(state: SearchQueryState, dateRange: DateRangeObj) {
  const queries = []
  queries.push(state.searchText ?? '')
  queries.push(
    state.language ? state.language.map((l) => `language:${l.toLowerCase()}`).join(' ') : '',
  )
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
    appendDateToFetch: (state, action: PayloadAction<DateRangeObj>) => {
      const d = getOldestDateRange(state.datesToFetch)
      const nd = d ? normalizedDateRangeToStartOfDay(d) : null

      if (
        !nd ||
        state.datesToFetch.findIndex((i) => i.start === nd.start && i.end === nd.end) === -1
      ) {
        state.datesToFetch.push(normalizedDateRangeToStartOfDay(action.payload))
      }
    },
    loadNextDateRange: (state) => {
      const d = getOldestDateRange(state.datesToFetch)
      if (!d) return

      const obj = generateDateRangeObj(state.dateRange, d)

      state.datesToFetch.push(normalizedDateRangeToStartOfDay(obj))
    },
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.repositories = []
      state.dateRange = action.payload

      state.datesToFetch = [normalizedDateRangeToStartOfDay(generateDateRangeObj(action.payload))]
    },
    setTopics: (state, action: PayloadAction<string[]>) => {
      state.topics = action.payload
    },
    setSort: (state, action: PayloadAction<string>) => {
      state.sort = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(searchApi.endpoints.search.matchFulfilled, (state, action) => {
      const d = getOldestDateRange(state.datesToFetch)
      if (!d) return

      if (
        state.repositories.findIndex(
          (r) => r.dateRange.start === d.start && r.dateRange.end === d.end,
        ) === -1
      ) {
        state.repositories = [
          ...state.repositories,
          {
            dateRange: state.datesToFetch[state.datesToFetch.length - 1],
            repos: action.payload.search.nodes,
            totalRepos: action.payload.search.repositoryCount,
          },
        ]
      }
    })
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
} = searchQuerySlice.actions

export default searchQuerySlice.reducer

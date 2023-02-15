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
  topic?: string
  sort?: string
  datesToFetch: DateRangeObj[]
  repositories: RepoGroup[]
}

const initialState: SearchQueryState = {
  searchText: '',
  language: ['Javascript'],
  stars: 20,
  dateRange: 'weekly',
  topic: undefined,
  sort: undefined,
  datesToFetch: [
    {
      end: getUnixTime(new Date()),
      start: getUnixTime(subWeeks(new Date(), 1)),
    },
  ],
  repositories: [],
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

  queries.push(state.topic ? `topic:${state.topic}` : '')
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
      state.datesToFetch = [...state.datesToFetch, action.payload]
    },
    loadNextDateRange: (state) => {
      const d = state.datesToFetch[state.datesToFetch.length - 1]

      const start = fromUnixTime(d.start)
      let fn: ((date: Date | number, amount: number) => Date) | null = null
      switch (state.dateRange) {
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
      state.datesToFetch = [
        ...state.datesToFetch,
        { start: getUnixTime(end), end: getUnixTime(start) },
      ]
    },
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      // state.dateRange = action.payload
      // let fn: ((date: Date | number, amount: number) => Date) | null = null
      // switch (state.dateRange) {
      //   case 'daily':
      //     fn = subDays
      //     break
      //   case 'weekly':
      //     fn = subWeeks
      //     break
      //   case 'monthly':
      //     fn = subMonths
      //     break
      // }
      // const now = startOfDay(new Date())
      // const start = fn(now, 1)
      // state.createdLast = {
      //   start: getUnixTime(start),
      //   end: getUnixTime(now),
      // }
    },
    setTopic: (state, action: PayloadAction<string>) => {
      state.topic = action.payload
    },
    setSort: (state, action: PayloadAction<string>) => {
      state.sort = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(searchApi.endpoints.search.matchFulfilled, (state, action) => {
      const d = state.datesToFetch[state.datesToFetch.length - 1]

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
  loadNextDateRange,
  appendDateToFetch,
} = searchQuerySlice.actions

export default searchQuerySlice.reducer

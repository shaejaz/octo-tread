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

export type DateRange = 'daily' | 'weekly' | 'monthly'

export interface SearchQueryState {
  searchText?: string
  searchTextIn?: string
  language: string[]
  stars: number
  dateRange: DateRange
  createdLast: {
    start: number
    end: number
  }
  topic?: string
  sort?: string
  query?: string
}

const initialState: SearchQueryState = {
  searchText: 'test',
  searchTextIn: undefined,
  language: ['Javascript'],
  stars: 20,
  dateRange: 'weekly',
  createdLast: {
    start: getUnixTime(new Date()),
    end: getUnixTime(subWeeks(new Date(), 1)),
  },
  topic: undefined,
  sort: undefined,
  query: undefined,
}

function generateQueryFn(state: SearchQueryState) {
  const queries = []
  queries.push(state.searchText ?? '')
  queries.push(state.searchTextIn ? `in:${state.searchTextIn}` : '')
  queries.push(
    state.language ? state.language.map((l) => `language:${l.toLowerCase()}`).join(' ') : '',
  )
  queries.push(state.stars ? `stars:>${state.stars}` : '')

  queries.push(
    state.createdLast
      ? `created:${format(fromUnixTime(state.createdLast.start), 'yyyy-MM-dd')}..${format(
          fromUnixTime(state.createdLast.end),
          'yyyy-MM-dd',
        )}`
      : '',
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
      state.query = generateQueryFn(state)
    },
    setSearchTextIn: (state, action: PayloadAction<string>) => {
      state.searchTextIn = action.payload
      state.query = generateQueryFn(state)
    },
    setLanguage: (state, action: PayloadAction<string[]>) => {
      state.language = action.payload
      state.query = generateQueryFn(state)
    },
    setStars: (state, action: PayloadAction<number | undefined>) => {
      state.stars = action.payload ?? 0
      state.query = generateQueryFn(state)
    },
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.dateRange = action.payload
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

      const now = startOfDay(new Date())
      const start = fn(now, 1)

      state.createdLast = {
        start: getUnixTime(start),
        end: getUnixTime(now),
      }

      state.query = generateQueryFn(state)
    },
    setTopic: (state, action: PayloadAction<string>) => {
      state.topic = action.payload
      state.query = generateQueryFn(state)
    },
    setSort: (state, action: PayloadAction<string>) => {
      state.sort = action.payload
      state.query = generateQueryFn(state)
    },
    generateQuery: (state) => {
      state.query = generateQueryFn(state)
    },
  },
})

export const { setSearchText, setLanguage, setStars, setDateRange, generateQuery } =
  searchQuerySlice.actions

export default searchQuerySlice.reducer

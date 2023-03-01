import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { enhancedGraphQlApi, SearchRepositoryResult } from './api'
import { DateRange } from '@octotread/models/dateRange'
import { DateStartEnd } from '@octotread/models/dateStartEnd'
import { RepositoryGroup } from '@octotread/models/repositoryGroup'
import {
  generateDateStartEnd,
  getOldestDateRange,
  normalizeDateStartEnd,
} from '@octotread/utils/dates'

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
      const nd = d ? normalizeDateStartEnd(d) : null

      if (
        !nd ||
        state.datesToFetch.findIndex((i) => i.start === nd.start && i.end === nd.end) === -1
      ) {
        state.datesToFetch.push(normalizeDateStartEnd(action.payload))
      }
    },
    loadNextDateRange: (state) => {
      const d = getOldestDateRange(state.datesToFetch)
      if (!d) return

      const obj = generateDateStartEnd(state.dateRange, d)

      state.datesToFetch.push(normalizeDateStartEnd(obj))
    },
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.repositories = []
      state.dateRange = action.payload

      // TODO: Remove use to `new Date()` in this reducer
      state.datesToFetch = [normalizeDateStartEnd(generateDateStartEnd(action.payload))]
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

      s.datesToFetch = [normalizeDateStartEnd(action.payload.newDateObj)]
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

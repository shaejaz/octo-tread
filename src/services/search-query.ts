import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { DateRange } from '@octotread/models/dateRange'
import { DateStartEnd } from '@octotread/models/dateStartEnd'
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
    setDatesToFetch: (state, action: PayloadAction<DateStartEnd[]>) => {
      state.datesToFetch = action.payload
    },
    setDateRange: (state, action: PayloadAction<DateRange>) => {
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
      return s
    },
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
  setDatesToFetch,
  resetQuery,
} = searchQuerySlice.actions

export default searchQuerySlice.reducer

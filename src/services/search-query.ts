import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { DateRange } from '@octotread/models/dateRange'
import { DateStartEnd } from '@octotread/models/dateStartEnd'
import { getItem } from '@octotread/utils/localstorage'

export const searchQueryKey = 'searchquery'

export interface SearchQueryState {
  searchText?: string
  language: string[]
  stars: number
  dateRange: DateRange
  topics: string[] // TODO: convert to list of Topics
  sort: string
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

const getInitialState = () => {
  const defaultState = {
    searchText: undefined,
    language: [],
    stars: 20,
    dateRange: 'weekly',
    topics: [],
    sort: 'stars-desc',
    itemsPerPage: 9,
  }
  try {
    const localstorageValue = getItem(searchQueryKey)
    if (localstorageValue) {
      return JSON.parse(localstorageValue)
    } else {
      return defaultState
    }
  } catch (error) {
    return defaultState
  }
}

const initialState: SearchQueryState = getInitialState()

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
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.dateRange = action.payload
    },
    setTopics: (state, action: PayloadAction<string[]>) => {
      state.topics = action.payload
    },
    setSort: (state, action: PayloadAction<string>) => {
      state.sort = action.payload
    },
    resetQuery: (state, action: PayloadAction<ResetQueryPayload>) => {
      const s = { ...state, ...action.payload.state }

      return s
    },
  },
})

export const { setSearchText, setLanguage, setStars, setDateRange, setTopics, resetQuery } =
  searchQuerySlice.actions

export default searchQuerySlice.reducer

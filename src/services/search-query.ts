import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface SearchQueryState {
  searchText?: string
  searchTextIn?: string
  language?: string
  stars?: number
  created?: string
  topic?: string
  sort?: string
  query?: string
}

const initialState: SearchQueryState = {
  searchText: 'test',
  searchTextIn: undefined,
  language: 'javascript',
  stars: undefined,
  created: undefined,
  topic: undefined,
  sort: undefined,
  query: undefined,
}

function generateQueryFn(state: SearchQueryState) {
  const queries = []
  queries.push(state.searchText ?? '')
  queries.push(state.searchTextIn ? `in:${state.searchTextIn}` : '')
  queries.push(state.language ? `language:${state.language}` : '')
  queries.push(state.stars ? `stars:${state.stars}` : '')
  queries.push(state.created ? `created:${state.created}` : '')
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
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
      state.query = generateQueryFn(state)
    },
    setStars: (state, action: PayloadAction<number>) => {
      state.stars = action.payload
      state.query = generateQueryFn(state)
    },
    setCreated: (state, action: PayloadAction<string>) => {
      state.created = action.payload
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

export const { generateQuery } = searchQuerySlice.actions

export default searchQuerySlice.reducer

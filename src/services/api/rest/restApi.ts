import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query'
import { RootState } from '../../store'

const baseRestQuery = fetchBaseQuery({
  baseUrl: 'https://api.github.com',
  // TODO: append additional GitHub headers
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    headers.set('Accept', 'application/vnd.github+json')
    return headers
  },
})

export const api = createApi({
  baseQuery: baseRestQuery,
  endpoints: () => ({}),
})

import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react'
import { RootState } from '@octotread/services/store'

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

export const baseRestApi = createApi({
  baseQuery: baseRestQuery,
  reducerPath: 'restApi',
  endpoints: () => ({}),
})

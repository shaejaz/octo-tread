import { RootState } from './../store'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'

const baseGraphQLQuery = graphqlRequestBaseQuery({
  url: 'https://api.github.com/graphql',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    headers.set('Accept', 'application/vnd.github.mercy-preview+json')
    return headers
  },
})

export const graphQlApi = createApi({
  baseQuery: baseGraphQLQuery,
  endpoints: () => ({}),
})

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

export const restApi = createApi({
  baseQuery: baseRestQuery,
  endpoints: () => ({}),
})

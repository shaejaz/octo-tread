import { createApi } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import { RootState } from '../../store'

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

export const api = createApi({
  baseQuery: baseGraphQLQuery,
  endpoints: () => ({}),
})

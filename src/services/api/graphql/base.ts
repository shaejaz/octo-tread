import { createApi } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import { RootState } from '@octotread/services/store'

// TODO: Check if possible to use octokit graphql for this
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

export const baseGraphQLApi = createApi({
  baseQuery: baseGraphQLQuery,
  reducerPath: 'graphqlApi',
  endpoints: () => ({}),
})

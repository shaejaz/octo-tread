import { createApi } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'

const baseQuery = graphqlRequestBaseQuery({
  url: 'https://api.github.com/graphql',
  prepareHeaders: (headers) => {
    const token = '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'
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const api = createApi({
  baseQuery: baseQuery,
  endpoints: () => ({}),
})

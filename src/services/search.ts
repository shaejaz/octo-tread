import { createApi } from '@reduxjs/toolkit/query/react'
import { gql } from 'graphql-request'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'

export interface Repository {
  id: string
  name: string
  description: string
}

export interface GetPostsResponse {
  search: {
    nodes: Repository[]
  }
}

export const api = createApi({
  baseQuery: graphqlRequestBaseQuery({
    url: 'https://api.github.com/graphql',
    prepareHeaders: (headers) => {
      const token = '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'
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    search: builder.query<GetPostsResponse, null>({
      query: () => ({
        document: gql`
          {
            search(query: "rails language:javascript", type: REPOSITORY, first: 5) {
              nodes {
                ... on Repository {
                  id
                  name
                  description
                }
              }
            }
          }
        `,
      }),
    }),
  }),
})

export const { useSearchQuery } = api

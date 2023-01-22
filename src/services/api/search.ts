import { gql } from 'graphql-request'
import { api } from '.'

export interface Repository {
  id: string
  name: string
  description: string
  stargazerCount: number
  owner: {
    login: string
  }
  languages: {
    nodes: { name: string }[]
  }
}

export interface GetPostsResponse {
  search: {
    nodes: Repository[]
  }
}

export const searchApi = api.injectEndpoints({
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
                  stargazerCount
                  owner {
                    login
                  }
                  languages(first: 10) {
                    nodes {
                      name
                    }
                  }
                }
              }
            }
          }
        `,
      }),
    }),
  }),
})

export const { useSearchQuery } = searchApi

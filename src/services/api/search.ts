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

export interface Pagination {
  pageInfo: {
    hasNextPage: boolean
    endCursor: string
    startCursor: string
    hasPreviousPage: boolean
  }
  repositoryCount: number
}

export interface SearchRepositoryResult extends Pagination {
  nodes: Repository[]
}

export interface GetPostsResponse {
  search: SearchRepositoryResult
}

export const searchApi = api.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query<
      GetPostsResponse,
      { q: string; endCursor?: string; startCursor?: string }
    >({
      query: ({ q, endCursor, startCursor }) => {
        const searchArgs = [`query: "${q}"`, 'type: REPOSITORY', 'first: 5']

        if (endCursor) {
          searchArgs.push(`before: "${endCursor}"`)
        }
        if (startCursor) {
          searchArgs.push(`after: "${startCursor}"`)
        }

        const search = searchArgs.join(', ')

        return {
          document: gql`
            {
              search(${search}) {
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
                pageInfo {
                  hasNextPage
                  endCursor
                  startCursor
                  hasPreviousPage
                }
                repositoryCount
              }
            }
          `,
        }
      },
    }),
  }),
})

export const { useSearchQuery, useLazySearchQuery } = searchApi

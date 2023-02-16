import { SearchQueryState, generateQueryFn } from './../search-query'
import { gql } from 'graphql-request'
import { graphQlApi } from '.'
import { DateRangeObj } from '../search-query'

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

export const searchApi = graphQlApi.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query<
      GetPostsResponse,
      { obj: SearchQueryState; dateRange: DateRangeObj; startCursor?: string }
    >({
      query: ({ obj, dateRange, startCursor }) => {
        obj = { ...obj }

        const q = generateQueryFn(obj, dateRange)
        const searchArgs = [`query: "${q}"`, 'type: REPOSITORY', `first: ${obj.itemsPerPage}`]

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

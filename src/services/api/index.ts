import { SearchRepositoriesQuery, api as _graphqlApi } from './graphql/SearchRepositories.generated'

export { api as graphQlApi } from './graphql/graphqlApi'
export { api as restApi } from './rest/restApi'
export * from './rest/topics'

type Response = Omit<SearchRepositoriesQuery, '__typename'>
type ResponseSearch = Omit<Response['search'], '__typename'>
type ResponseSearchNodes = Array<
  Extract<NonNullable<ResponseSearch['nodes']>[0], { __typename?: 'Repository' }>
>

const transform = (res: SearchRepositoriesQuery) => {
  if (res.search.nodes) {
    const repositories = (res.search.nodes as ResponseSearchNodes).map((i) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __typename, ...temp } = i
      const owner = i.owner
      const languages = i.languages?.nodes?.map((i) => i.name)
      const topics = i.languages?.nodes?.map((i) => i.name)
      return { ...temp, owner, language: languages || [], repositoryTopics: topics || topics }
    })

    return { repositoryCount: res.search.repositoryCount, repositories: repositories }
  }

  return undefined
}

export type SearchRepositoryResult = NonNullable<ReturnType<typeof transform>>

export const graphQlApiTest = _graphqlApi.enhanceEndpoints({
  endpoints: {
    SearchRepositories: {
      // Currently a bug in the enhanceEndpoints and GraphQL Codegen components:
      // https://github.com/reduxjs/redux-toolkit/issues/1927
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      transformResponse: transform,
    },
  },
})

export const { useSearchRepositoriesQuery, useLazySearchRepositoriesQuery } = graphQlApiTest

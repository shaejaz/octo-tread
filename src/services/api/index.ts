import { SearchRepositoriesQuery, api as graphqlApi } from './graphql/generated/SearchRepositories'

export { baseRestApi as restApi } from './rest/base'
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
      const languages = i.languages?.nodes?.map((i) => i?.name)
      const topics = i.repositoryTopics?.nodes?.map((i) => i?.topic.name)
      return { ...temp, owner, language: languages || [], repositoryTopics: topics || [] }
    })

    return { repositoryCount: res.search.repositoryCount, repositories: repositories }
  }

  return undefined
}

export type SearchRepositoryResult = NonNullable<ReturnType<typeof transform>>

export const enhancedGraphQlApi = graphqlApi.enhanceEndpoints({
  endpoints: {
    SearchRepositories: {
      // Currently a bug in the enhanceEndpoints and GraphQL Codegen components:
      // https://github.com/reduxjs/redux-toolkit/pull/2953
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      transformResponse: transform,
    },
  },
})

export const { useSearchRepositoriesQuery, useLazySearchRepositoriesQuery } = enhancedGraphQlApi

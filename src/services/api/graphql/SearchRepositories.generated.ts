/* eslint-disable */ /**
 *
 * THIS FILE IS AUTOGENERATED, DO NOT EDIT IT!
 *
 * instead, edit one of the `.graphql` files in this project and run
 *
 * npm run graphql-codegen
 *
 * for this file to be re-created
 */

import * as Types from './types.generated';

import { api } from './graphqlApi';
export type SearchRepositoriesQueryVariables = Types.Exact<{
  q: Types.Scalars['String'];
  reposfirst: Types.Scalars['Int'];
  type?: Types.InputMaybe<Types.SearchType>;
  langFirst?: Types.InputMaybe<Types.Scalars['Int']>;
  topicsFirst?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type SearchRepositoriesQuery = { __typename?: 'Query', search: { __typename?: 'SearchResultItemConnection', repositoryCount: number, nodes?: Array<{ __typename?: 'App' } | { __typename?: 'Discussion' } | { __typename?: 'Issue' } | { __typename?: 'MarketplaceListing' } | { __typename?: 'Organization' } | { __typename?: 'PullRequest' } | { __typename?: 'Repository', id: string, name: string, description?: string, stargazerCount: number, owner: { __typename?: 'Organization', login: string } | { __typename?: 'User', login: string }, languages?: { __typename?: 'LanguageConnection', nodes?: Array<{ __typename?: 'Language', name: string }> }, repositoryTopics: { __typename?: 'RepositoryTopicConnection', nodes?: Array<{ __typename?: 'RepositoryTopic', topic: { __typename?: 'Topic', name: string, id: string } }> } } | { __typename?: 'User' }> } };


export const SearchRepositoriesDocument = `
    query SearchRepositories($q: String!, $reposfirst: Int!, $type: SearchType = REPOSITORY, $langFirst: Int = 4, $topicsFirst: Int = 10) {
  search(type: $type, first: $reposfirst, query: $q) {
    nodes {
      ... on Repository {
        id
        name
        description
        stargazerCount
        owner {
          login
        }
        languages(first: $langFirst) {
          nodes {
            name
          }
        }
        repositoryTopics(first: $topicsFirst) {
          nodes {
            topic {
              name
              id
            }
          }
        }
      }
    }
    repositoryCount
  }
}
    `;

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    SearchRepositories: build.query<SearchRepositoriesQuery, SearchRepositoriesQueryVariables>({
      query: (variables) => ({ document: SearchRepositoriesDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };
export const { useSearchRepositoriesQuery, useLazySearchRepositoriesQuery } = injectedRtkApi;


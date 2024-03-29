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

import * as Types from './types';

import { baseGraphQLApi } from '../base';
export type SearchRepositoriesQueryVariables = Types.Exact<{
  q: Types.Scalars['String'];
  reposfirst: Types.Scalars['Int'];
  type?: Types.InputMaybe<Types.SearchType>;
  langFirst?: Types.InputMaybe<Types.Scalars['Int']>;
  topicsFirst?: Types.InputMaybe<Types.Scalars['Int']>;
  after?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type SearchRepositoriesQuery = { __typename?: 'Query', search: { __typename?: 'SearchResultItemConnection', repositoryCount: number, nodes?: Array<{ __typename?: 'App' } | { __typename?: 'Discussion' } | { __typename?: 'Issue' } | { __typename?: 'MarketplaceListing' } | { __typename?: 'Organization' } | { __typename?: 'PullRequest' } | { __typename?: 'Repository', id: string, name: string, description?: string | null, stargazerCount: number, url: any, owner: { __typename?: 'Organization', url: any, login: string, avatarUrl: any } | { __typename?: 'User', url: any, login: string, avatarUrl: any }, languages?: { __typename?: 'LanguageConnection', nodes?: Array<{ __typename?: 'Language', color?: string | null, name: string } | null> | null } | null, repositoryTopics: { __typename?: 'RepositoryTopicConnection', nodes?: Array<{ __typename?: 'RepositoryTopic', topic: { __typename?: 'Topic', name: string, id: string } } | null> | null } } | { __typename?: 'User' } | null> | null } };


export const SearchRepositoriesDocument = `
    query SearchRepositories($q: String!, $reposfirst: Int!, $type: SearchType = REPOSITORY, $langFirst: Int = 4, $topicsFirst: Int = 10, $after: String) {
  search(type: $type, first: $reposfirst, query: $q, after: $after) {
    nodes {
      ... on Repository {
        id
        name
        description
        stargazerCount
        url
        owner {
          url
          login
          avatarUrl
        }
        languages(first: $langFirst) {
          nodes {
            color
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

const injectedRtkApi = baseGraphQLApi.injectEndpoints({
  endpoints: (build) => ({
    SearchRepositories: build.query<SearchRepositoriesQuery, SearchRepositoriesQueryVariables>({
      query: (variables) => ({ document: SearchRepositoriesDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };
export const { useSearchRepositoriesQuery, useLazySearchRepositoriesQuery } = injectedRtkApi;


import { restApi } from '..'

// TODO: use response schema to generate these: https://docs.github.com/en/rest/search?apiVersion=2022-11-28#search-topics
export interface TopicSearchQuery {
  text?: string
  curated?: boolean
  featured?: boolean
  repositories?: number
}

export interface Topic {
  name: string
  display_name: string
  short_description: string
  description: string
  created_by: string
  released: string
  created_at: string
  updated_at: string
  featured: boolean
  curated: boolean
  score: number
}

export interface SearchTopicResponse {
  total_count: number
  incomplete_results: boolean
  items: Topic[]
}

export const topicsApi = restApi.injectEndpoints({
  endpoints: (builder) => ({
    SearchTopic: builder.query<SearchTopicResponse, { q: TopicSearchQuery }>({
      query: ({ q }) => {
        const queryArr = []

        if (q.text) {
          queryArr.push(q.text)
        }
        if (q.curated) {
          queryArr.push('is:curated')
        }
        if (q.featured) {
          queryArr.push('is:featured')
        }
        if (q.repositories !== undefined) {
          queryArr.push(`repositories:>${q.repositories}`)
        }

        const finalQuery = queryArr.join(' ')
        return {
          url: `/search/topics?q=${finalQuery}`,
        }
      },
    }),
  }),
})

export const { useSearchTopicQuery, useLazySearchTopicQuery } = topicsApi

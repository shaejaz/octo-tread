import { Topic } from '@octotread/models/topic'
import { restApi } from '..'

export interface TopicSearchQuery {
  text?: string
  curated?: boolean
  featured?: boolean
  repositories?: number
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
        if (q.featured) {
          queryArr.push('is:featured')
        } else {
          queryArr.push('is:not-featured')
        }
        if (q.curated) {
          queryArr.push('is:curated')
        } else {
          queryArr.push('is:not-curated')
        }
        if (q.repositories !== undefined) {
          queryArr.push(`repositories:>${q.repositories}`)
        }

        const finalQuery = queryArr.join(' ')
        const queryString = queryArr.length ? `q=${finalQuery}` : ''
        return {
          url: `/search/topics?${queryString}`,
        }
      },
    }),
  }),
})

export const { useSearchTopicQuery, useLazySearchTopicQuery } = topicsApi

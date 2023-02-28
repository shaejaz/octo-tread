import { Languages } from '@octotread/models/language'
import { restApi } from '..'

export const languagesApi = restApi.injectEndpoints({
  endpoints: (builder) => ({
    GetPopular: builder.query<Languages, void>({
      query: () => {
        return {
          url: `https://raw.githubusercontent.com/shaejaz/octo-tread/main/resources/languages/popular.json`,
          headers: { noHeaders: 'yes' },
        }
      },
    }),
    GetAll: builder.query<Languages, void>({
      query: () => {
        return {
          url: 'https://raw.githubusercontent.com/shaejaz/octo-tread/main/resources/languages/all.json',
          headers: { noHeaders: 'yes' },
        }
      },
    }),
  }),
})

export const { useGetPopularQuery, useLazyGetPopularQuery, useGetAllQuery, useLazyGetAllQuery } =
  languagesApi

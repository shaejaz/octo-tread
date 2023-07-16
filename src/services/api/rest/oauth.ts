import { restApi } from '..'

export const oauthApi = restApi.injectEndpoints({
  endpoints: (builder) => ({
    PostAPIToken: builder.query<void, string>({
      query: (token) => {
        return {
          url: 'http://localhost:3000/api/oauth/token',
          method: 'POST',
          body: {
            code: token,
          },
          headers: { noHeaders: 'yes' },
        }
      },
    }),
  }),
})

export const { usePostAPITokenQuery, useLazyPostAPITokenQuery } = oauthApi

import { restApi } from '..'

interface OAuthTokenResponse {
  access_token: string
  token_type: string
  scope: string
}

export const oauthApi = restApi.injectEndpoints({
  endpoints: (builder) => ({
    PostAPIToken: builder.query<OAuthTokenResponse, string>({
      query: (token) => {
        const params = new URLSearchParams({
          code: token,
        })

        return {
          url: `https://octotread.azurewebsites.net/api/github-oauth?${params.toString()}`,
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

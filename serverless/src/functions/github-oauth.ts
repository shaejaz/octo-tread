import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import post from 'axios'

async function postGithubAccessToken(code: string) {
  const response = await post('https://github.com/login/oauth/access_token', {
    headers: {
      Accept: 'application/json',
    },
    data: {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code,
    },
  })

  return response
}

export async function handler(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`)

  const code = request.query.get('code')

  if (code) {
    try {
      const response = await postGithubAccessToken(code)

      return {
        status: 200,
        body: JSON.stringify(response.data),
      }
    } catch (error) {
      context.log(error)

      return {
        status: 500,
        body: 'Something went wrong',
      }
    }
  } else {
    return {
      status: 400,
      body: 'Bad Request',
    }
  }
}

app.http('github-oauth', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: handler,
})

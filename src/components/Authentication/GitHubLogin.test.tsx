import { fireEvent, render, screen, waitFor } from '@octotread/test/utils'
import { GitHubLogin } from './GitHubLogin'
import { Provider } from 'react-redux'
import { createStore } from '@octotread/services/store'
import { vi } from 'vitest'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

const server = setupServer(
  rest.post('https://octotread.azurewebsites.net/api/github-oauth', (req, res, ctx) => {
    return res(
      ctx.json({
        access_token: 'test-code',
      }),
    )
  }),
)

describe('GitHubLogin', () => {
  it('should render', () => {
    render(
      <Provider store={createStore()}>
        <GitHubLogin
          isTokenSaved={false}
          onTokenRecieved={() => {
            return 0
          }}
        />
      </Provider>,
    )

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should show a disabled button when token is saved', () => {
    render(
      <Provider store={createStore()}>
        <GitHubLogin
          isTokenSaved={true}
          onTokenRecieved={() => {
            return 0
          }}
        />
      </Provider>,
    )

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('open window when login button is clicked', async () => {
    const openFn = vi.fn()
    vi.stubGlobal('open', openFn)

    render(
      <Provider store={createStore()}>
        <GitHubLogin
          isTokenSaved={false}
          onTokenRecieved={() => {
            return 0
          }}
        />
      </Provider>,
    )

    const loginButton = screen.getByRole('button')
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(openFn).toBeCalled()
    })
  })

  it('should send code when login button clicked and logged in successfully', async () => {
    server.listen()

    const tokenRecievedFn = vi.fn()

    render(
      <Provider store={createStore()}>
        <GitHubLogin isTokenSaved={false} onTokenRecieved={tokenRecievedFn} />
      </Provider>,
    )

    const loginButton = screen.getByRole('button')
    fireEvent.click(loginButton)

    fireEvent(
      window,
      new MessageEvent('message', { origin: 'http://localhost:3000', data: { code: 'test-code' } }),
    )

    await waitFor(() => {
      expect(tokenRecievedFn).toBeCalledWith('test-code')
    })
  })
})

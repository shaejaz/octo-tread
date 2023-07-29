import { fireEvent, render, screen, waitFor } from '@octotread/test/utils'
import { Provider } from 'react-redux'
import { Authentication } from '.'
import { createStore } from '@octotread/services/store'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { vi } from 'vitest'
import { prefix } from '@octotread/utils/localstorage'

const server = setupServer(
  rest.post('https://octotread.azurewebsites.net/api/github-oauth', (req, res, ctx) => {
    return res(
      ctx.json({
        access_token: 'test-code',
      }),
    )
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Authentication', () => {
  it('should render', () => {
    render(
      <Provider store={createStore()}>
        <Authentication />
      </Provider>,
    )

    expect(screen.getByRole('heading', { name: /authenticate using either/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/personal access token/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /github/i })).toBeInTheDocument()
  })

  it('should save pat token when received from pat form', async () => {
    const setItem = vi.fn()
    vi.stubGlobal('localStorage', {
      setItem: setItem,
    })

    render(
      <Provider store={createStore()}>
        <Authentication />
      </Provider>,
    )

    const input = screen.getByPlaceholderText(/personal access token/i)
    fireEvent.change(input, { target: { value: 'test-token' } })

    const button = screen.getByRole('button', { name: /save/i })
    fireEvent.click(button)

    await waitFor(() => expect(setItem).toBeCalledWith(`${prefix}token`, 'test-token'))
  })

  it('should save github oauth token when received from github login', async () => {
    const setItem = vi.fn()
    vi.stubGlobal('localStorage', {
      setItem: setItem,
    })

    render(
      <Provider store={createStore()}>
        <Authentication />
      </Provider>,
    )

    const button = screen.getByRole('button', { name: /github/i })
    fireEvent.click(button)

    fireEvent(
      window,
      new MessageEvent('message', { origin: 'http://localhost:3000', data: { code: 'test-code' } }),
    )

    await waitFor(() => expect(setItem).toBeCalledWith(`${prefix}oauthToken`, 'test-code'))
  })
})

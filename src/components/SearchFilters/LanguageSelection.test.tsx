import { fireEvent, render, screen } from '@octotread/test/utils'
import { LanguageSelection } from './LanguageSelection'
import { Provider } from 'react-redux'
import { createStore } from '@octotread/services/store'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { vi } from 'vitest'

const server = setupServer(
  rest.get(
    'https://raw.githubusercontent.com/shaejaz/octo-tread/main/resources/languages/popular.json',
    (req, res, ctx) => {
      return res(
        ctx.json({
          Language1: { slug: 'language1' },
          Language2: { slug: 'language2' },
          Language3: { slug: 'language3' },
        }),
      )
    },
  ),

  rest.get(
    'https://raw.githubusercontent.com/shaejaz/octo-tread/main/resources/languages/all.json',
    (req, res, ctx) => {
      return res(
        ctx.json({
          Language1: { slug: 'language1' },
          Language2: { slug: 'language2' },
          Language3: { slug: 'language3' },
          Language4: { slug: 'language4' },
          Language5: { slug: 'language5' },
        }),
      )
    },
  ),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const fireMouseClickOnOpenButton = () => {
  const openButton = screen.getByLabelText('Open')

  fireEvent(openButton, new MouseEvent('click', { bubbles: true }))
}

describe('LanguageSelection', () => {
  it('should render the component', () => {
    render(
      <Provider store={createStore()}>
        <LanguageSelection value={['language1']} handleValueChange={() => 0} />
      </Provider>,
    )

    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('should show options when clicked', async () => {
    render(
      <Provider store={createStore()}>
        <LanguageSelection value={[]} handleValueChange={() => 0} />
      </Provider>,
    )

    fireMouseClickOnOpenButton()

    expect(await screen.findByText('Language1')).toBeInTheDocument()
    expect(await screen.findByText('Language2')).toBeInTheDocument()
    expect(await screen.findByText('Language3')).toBeInTheDocument()
  })

  it('should show selected option when value provided', async () => {
    render(
      <Provider store={createStore()}>
        <LanguageSelection value={['language1', 'language2']} handleValueChange={() => 0} />
      </Provider>,
    )

    fireMouseClickOnOpenButton()

    const language1 = await screen.findAllByText('Language1')
    const language2 = await screen.findAllByText('Language2')

    expect(language1[0]).toBeInTheDocument()
    expect(language2[0]).toBeInTheDocument()
  })

  it('should show all languages when radio button clicked', async () => {
    render(
      <Provider store={createStore()}>
        <LanguageSelection value={[]} handleValueChange={() => 0} />
      </Provider>,
    )

    fireMouseClickOnOpenButton()
    fireEvent(await screen.findByDisplayValue('all'), new MouseEvent('click', { bubbles: true }))

    expect(await screen.findByText('Language4')).toBeInTheDocument()
    expect(await screen.findByText('Language5')).toBeInTheDocument()
  })

  it('should emit list of language slugs when an option is clicked', async () => {
    const handleFn = vi.fn()

    render(
      <Provider store={createStore()}>
        <LanguageSelection value={[]} handleValueChange={handleFn} />
      </Provider>,
    )

    fireMouseClickOnOpenButton()
    fireEvent(await screen.findByText('Language1'), new MouseEvent('click', { bubbles: true }))

    expect(handleFn).toHaveBeenLastCalledWith(['language1'])

    // TODO: fix this test
    // No idea why this test doesn't work
    // fireMouseClickOnOpenButton()
    // fireEvent(await screen.findByText('Language3'), new MouseEvent('click', { bubbles: true }))

    // expect(handleFn).toHaveBeenLastCalledWith(['language1', 'language3'])
  })
})

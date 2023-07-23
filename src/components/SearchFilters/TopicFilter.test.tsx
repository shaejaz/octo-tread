import { createStore } from '@octotread/services/store'
import { fireEvent, render, screen, waitForElementToBeRemoved } from '@octotread/test/utils'
import { Provider } from 'react-redux'
import { TopicFilter } from './TopicFilter'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.get('https://api.github.com/search/topics', (req, res, ctx) => {
    return res(
      ctx.json({
        items: [
          { name: 'Topic1', display_name: 'Topic 1' },
          { name: 'Topic2', display_name: 'Topic 2' },
          { name: 'Topic3', display_name: 'Topic 3' },
        ],
        total_count: 3,
        incomplete_results: false,
      }),
    )
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('TopicFilter', () => {
  it('should render the component', () => {
    render(
      <Provider store={createStore()}>
        <TopicFilter handleValueChange={() => 0} />
      </Provider>,
    )

    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('should show options when clicked', async () => {
    render(
      <Provider store={createStore()}>
        <TopicFilter handleValueChange={() => 0} />
      </Provider>,
    )

    const openButton = screen.getByLabelText('Open')

    fireEvent(openButton, new MouseEvent('click', { bubbles: true }))

    await waitForElementToBeRemoved(() => screen.getByTestId('loading-container'))

    // expect(screen.getByRole('option')).toBeInTheDocument()
    expect(screen.getByText('Topic 1')).toBeInTheDocument()
    expect(screen.getByText('Topic 2')).toBeInTheDocument()
    expect(screen.getByText('Topic 3')).toBeInTheDocument()
  })
})

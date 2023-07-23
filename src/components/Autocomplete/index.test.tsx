import { fireEvent, render, screen } from '@octotread/test/utils'
import { Autocomplete } from '.'

const fireMouseClickOnOpenButton = () => {
  const openButton = screen.getByLabelText('Open')

  fireEvent(openButton, new MouseEvent('click', { bubbles: true }))
}

describe('Autocomplete', () => {
  it('should render correctly', () => {
    render(<Autocomplete options={[1, 2, 3, 4]} />)

    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('should render input props correctly', () => {
    render(
      <Autocomplete
        options={[1, 2, 3, 4]}
        customInputProps={{ placeholder: 'Select an option', label: 'Options combobox' }}
      />,
    )

    expect(screen.getAllByText('Options combobox')[0]).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'Select an option')
  })

  it('should render header correctly', async () => {
    render(<Autocomplete options={[1, 2, 3, 4]} renderHeader={<div>Header</div>} />)

    fireMouseClickOnOpenButton()

    expect(await screen.findByText('Header')).toBeInTheDocument()
  })

  it('should render loading correctly', async () => {
    render(<Autocomplete options={[1, 2, 3, 4]} loading />)

    fireMouseClickOnOpenButton()

    expect(await screen.findByTestId('loading-container')).toBeInTheDocument()
  })

  it('should render options correctly when header provided', async () => {
    render(
      <Autocomplete
        options={[1, 2, 3, 4]}
        getOptionLabel={(option) => `Option ${option}`}
        renderHeader={<div>Header</div>}
      />,
    )

    fireMouseClickOnOpenButton()

    expect(await screen.findByText('Option 1')).toBeInTheDocument()
  })

  it('should render options correctly when header not provided', async () => {
    render(<Autocomplete options={[1, 2, 3, 4]} getOptionLabel={(option) => `Option ${option}`} />)

    fireMouseClickOnOpenButton()

    expect(await screen.findByText('Option 1')).toBeInTheDocument()
  })
})

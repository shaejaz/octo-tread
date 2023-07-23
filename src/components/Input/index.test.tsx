import { fireEvent, render, screen } from '@octotread/test/utils'
import { Input } from '.'

describe('Input', () => {
  it('should render the input component', () => {
    render(
      <Input name='email' type='email' error={false} placeholder='Email' label='Email Address' />,
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should show tooltip when tooltip text provided', async () => {
    render(
      <Input
        name='email'
        type='email'
        error={false}
        placeholder='Email'
        label='Email Address'
        tooltipText='This is a tooltip'
      />,
    )

    const iconContainer = screen.getAllByLabelText('This is a tooltip')[0]

    fireEvent.mouseOver(iconContainer)

    expect(await screen.findByRole('tooltip')).toHaveTextContent('This is a tooltip')
  })

  it('should show error adornment when error is true', () => {
    render(<Input name='email' type='email' error label='Email Address' />)

    expect(screen.getByTestId('icon-container')).toBeInTheDocument()
  })

  it('should show error message when error icon is hovered', async () => {
    render(
      <Input name='email' type='email' error label='Email Address' helperText='Email not valid' />,
    )

    fireEvent.mouseOver(screen.getByTestId('icon-container'))

    expect(await screen.findByRole('tooltip')).toHaveTextContent('Email not valid')
  })
})

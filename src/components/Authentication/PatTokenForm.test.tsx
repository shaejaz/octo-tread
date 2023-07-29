import { fireEvent, render, screen } from '@octotread/test/utils'
import { PatTokenForm } from './PatTokenForm'
import { vi } from 'vitest'

const alreadySavedText = 'Already Saved'
const saveText = 'Save'
const confirmTokenRemovalText = 'Confirm token removal'

describe('PatTokenForm', () => {
  it('should render', () => {
    render(
      <PatTokenForm
        token=''
        handleTokenSave={() => {
          return 0
        }}
      />,
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should show a disabled save button when token is not set', () => {
    render(
      <PatTokenForm
        token=''
        handleTokenSave={() => {
          return 0
        }}
      />,
    )

    expect(screen.getByRole('button')).toHaveTextContent(saveText)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should show a disabled save button when token is set and input token is not set', () => {
    render(
      <PatTokenForm
        token='123'
        handleTokenSave={() => {
          return 0
        }}
      />,
    )

    expect(screen.getByRole('button')).toHaveTextContent(alreadySavedText)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should enable the save button when token and input are set and not the same', async () => {
    render(
      <PatTokenForm
        token='123'
        handleTokenSave={() => {
          return 0
        }}
      />,
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '1234' } })

    expect(await screen.findByRole('button')).toHaveTextContent(saveText)
    expect(await screen.findByRole('button')).not.toBeDisabled()
  })

  it('should disable the save button when token and input are set and the same', async () => {
    render(
      <PatTokenForm
        token='123'
        handleTokenSave={() => {
          return 0
        }}
      />,
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '123' } })

    expect(await screen.findByRole('button')).toHaveTextContent(alreadySavedText)
    expect(await screen.findByRole('button')).toBeDisabled()
  })

  it('should show confirm token removal text when token is set and input token is removed', async () => {
    render(
      <PatTokenForm
        token='123'
        handleTokenSave={() => {
          return 0
        }}
      />,
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '' } })

    expect(await screen.findByRole('button')).toHaveTextContent(confirmTokenRemovalText)
    expect(await screen.findByRole('button')).not.toBeDisabled()
  })

  it('should send token to handleTokenSave when save button is clicked', async () => {
    const handleTokenSave = vi.fn()

    render(<PatTokenForm token='' handleTokenSave={handleTokenSave} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '123' } })

    const button = await screen.findByRole('button')
    fireEvent.click(button)

    expect(handleTokenSave).toHaveBeenCalledWith('123')
  })
})

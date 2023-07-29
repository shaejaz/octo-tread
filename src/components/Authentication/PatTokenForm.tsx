import { Button, Stack } from '@mui/material'
import { useMemo, useState } from 'react'
import { Input } from '@octotread/components/Input'
import { Icon } from '@iconify/react'

interface Props {
  token: string
  handleTokenSave: (token: string) => void
}

export const PatTokenForm = (props: Props) => {
  const { token, handleTokenSave } = props

  const [inputToken, setInputToken] = useState(token)

  const tokenSet = useMemo(() => token !== '', [token])
  const inputTokenSet = useMemo(() => inputToken !== '', [inputToken])
  const tokenAndInputTokenSame = useMemo(() => token === inputToken, [token, inputToken])

  const patTokenState = useMemo(() => {
    if (!tokenSet && !inputTokenSet) return { isDisabled: true, text: 'Save', showIcon: false }

    if (!tokenSet && inputTokenSet) return { isDisabled: false, text: 'Save', showIcon: false }

    if (tokenSet && inputTokenSet && tokenAndInputTokenSame)
      return { isDisabled: true, text: 'Already Saved', showIcon: true }

    if (tokenSet && !inputTokenSet)
      return { isDisabled: false, text: 'Confirm token removal', showIcon: false }

    if (tokenSet && inputTokenSet && !tokenAndInputTokenSame)
      return { isDisabled: false, text: 'Save', showIcon: false }

    return { isDisabled: false, text: 'Save', showIcon: true }
  }, [tokenSet, inputTokenSet, tokenAndInputTokenSame])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputToken(event.target.value)
  }

  const handleSaveClick = () => {
    handleTokenSave(inputToken)
  }

  return (
    <Stack direction='column' spacing={2}>
      <Input placeholder='Personal Access Token' value={inputToken} onChange={handleChange} />

      <Button
        variant='contained'
        startIcon={patTokenState.showIcon ? <Icon icon='ic:round-check' /> : null}
        disabled={patTokenState.isDisabled}
        sx={{ alignSelf: 'center', transition: 'none' }}
        onClick={handleSaveClick}
      >
        {patTokenState.text}
      </Button>
    </Stack>
  )
}

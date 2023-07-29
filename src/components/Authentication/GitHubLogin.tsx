import { Icon } from '@iconify/react'
import { Button, styled, useTheme } from '@mui/material'
import { useLazyPostAPITokenQuery } from '@octotread/services/api/rest/oauth'
import { useEffect } from 'react'

const GitHubButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#347d39',
  borderRadius: '6px',
  textTransform: 'none',
  color: theme.palette.common.white,
  paddingInline: theme.spacing(5),
  '&:hover': {
    backgroundColor: '#46954a',
  },
}))

interface Props {
  isTokenSaved: boolean
  onTokenRecieved: (token: string) => void
}

export const GitHubLogin = (props: Props) => {
  const { isTokenSaved, onTokenRecieved } = props

  const theme = useTheme()

  const [trigger, data] = useLazyPostAPITokenQuery()

  useEffect(() => {
    if (data.data) {
      onTokenRecieved(data.data.access_token)
    }
  }, [data, onTokenRecieved])

  const handleLoginClick = () => {
    const params = new URLSearchParams({
      client_id: 'ddaf758c62618e0fe264',
    })
    const url = `https://github.com/login/oauth/authorize?${params.toString()}`

    const loginWindow = window.open(
      url,
      'Authorize Octotread',
      'location=yes,height=570,width=520,scrollbars=yes,status=yes',
    )

    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return
      const { code } = event.data

      if (code) {
        loginWindow?.close()
        trigger(code)
      }
    })
  }

  return (
    <GitHubButton
      startIcon={<Icon icon='mdi:github' />}
      endIcon={
        isTokenSaved ? (
          <Icon icon='ic:round-check' />
        ) : data.isFetching ? (
          'line-md:loading-loop'
        ) : null
      }
      sx={
        isTokenSaved
          ? {
              backgroundColor: 'transparent',
              border: `1px solid ${theme.palette.action.disabled}`,
              alignSelf: 'center',
            }
          : { alignSelf: 'center' }
      }
      disabled={isTokenSaved}
      onClick={handleLoginClick}
    >
      {isTokenSaved ? 'Already logged in with GitHub' : 'Login with GitHub'}
    </GitHubButton>
  )
}

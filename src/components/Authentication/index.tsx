import { RootState } from '@octotread/services/store'
import { useDispatch, useSelector } from 'react-redux'
import { Input } from '@octotread/components/Input'
import { Box, Button, Link, Stack, Typography, styled, useTheme } from '@mui/material'
import { useLazyPostAPITokenQuery } from '@octotread/services/api/rest/oauth'
import { useEffect, useMemo, useState } from 'react'
import { Icon } from '@iconify/react'
import { setOauthToken, setToken } from '@octotread/services/auth'

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

export const Authentication = () => {
  const token = useSelector((state: RootState) => state.auth.token)
  const oauthToken = useSelector((state: RootState) => state.auth.oauthToken)

  const theme = useTheme()
  const dispatch = useDispatch()

  const [inputToken, setInputToken] = useState(token)

  const oauthSaved = oauthToken !== ''

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

  const [trigger, data] = useLazyPostAPITokenQuery()

  useEffect(() => {
    if (data.data) {
      dispatch(setOauthToken(data.data.access_token))
      console.log(data)
    }
  }, [data, dispatch])

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputToken(event.target.value)
  }

  const handleSaveClick = () => {
    dispatch(setToken(inputToken))
  }

  return (
    <Stack direction='column' spacing={3}>
      <Typography variant='h4'>Authenticate using either</Typography>

      <Stack direction='column' spacing={2}>
        <Typography variant='h5'>1. Personal Access Token</Typography>

        <Box component='ul'>
          <Typography component='li' variant='body1'>
            Go to the{' '}
            <Link href='https://github.com/settings/tokens/new?description=octotread'>
              GitHub token settings page
            </Link>{' '}
            and generate the token (no scopes needed).
          </Typography>
          <Typography component='li' variant='body1'>
            Copy the presented token and paste it in the input field below.
          </Typography>
        </Box>

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

      <Stack direction='column' spacing={2}>
        <Typography variant='h5'>2. GitHub OAuth</Typography>

        <GitHubButton
          startIcon={<Icon icon='mdi:github' />}
          endIcon={
            oauthSaved ? (
              <Icon icon='ic:round-check' />
            ) : data.isFetching ? (
              'line-md:loading-loop'
            ) : null
          }
          sx={
            oauthSaved
              ? {
                  backgroundColor: 'transparent',
                  border: `1px solid ${theme.palette.action.disabled}`,
                  alignSelf: 'center',
                }
              : { alignSelf: 'center' }
          }
          disabled={oauthSaved}
          onClick={handleLoginClick}
        >
          {oauthSaved ? 'Already logged in with GitHub' : 'Login with GitHub'}
        </GitHubButton>

        {oauthSaved && (
          <Button
            variant='contained'
            startIcon={<Icon icon='ic:round-check' />}
            sx={{ alignSelf: 'center' }}
            onClick={() => dispatch(setOauthToken(''))}
          >
            Logout
          </Button>
        )}
      </Stack>
    </Stack>
  )
}

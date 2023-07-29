import { RootState } from '@octotread/services/store'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Link, Stack, Tooltip, Typography } from '@mui/material'
import { Icon } from '@iconify/react'
import { setOauthToken, setToken } from '@octotread/services/auth'
import { GitHubLogin } from './GitHubLogin'
import { PatTokenForm } from './PatTokenForm'

export const Authentication = () => {
  const token = useSelector((state: RootState) => state.auth.token)
  const oauthToken = useSelector((state: RootState) => state.auth.oauthToken)

  const dispatch = useDispatch()

  const oauthSaved = oauthToken !== ''

  const handleTokenRecieved = (token: string) => {
    dispatch(setOauthToken(token))
  }

  const handleTokenSave = (token: string) => {
    dispatch(setToken(token))
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

        <PatTokenForm token={token} handleTokenSave={handleTokenSave} />
      </Stack>

      <Stack direction='column' spacing={2}>
        <Typography variant='h5'>2. GitHub OAuth</Typography>

        <GitHubLogin isTokenSaved={oauthSaved} onTokenRecieved={handleTokenRecieved} />

        {oauthSaved && (
          <Tooltip title='You will still need to remove OctoTread from your GitHub accounts OAuth page'>
            <Button
              variant='contained'
              onClick={() => dispatch(setOauthToken(''))}
              sx={{ alignSelf: 'center' }}
            >
              <Stack direction='row' alignItems='center' spacing={1}>
                <Typography sx={{ color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }}>
                  Remove OAuth token
                </Typography>
                <Icon icon='material-symbols:info-outline' />
              </Stack>
            </Button>
          </Tooltip>
        )}
      </Stack>
    </Stack>
  )
}

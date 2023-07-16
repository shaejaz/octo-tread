import { RootState } from '@octotread/services/store'
import { useSelector } from 'react-redux'
import { Input } from '@octotread/components/Input'
import { Button, Link, Stack, Typography } from '@mui/material'
import { useLazyPostAPITokenQuery } from '@octotread/services/api/rest/oauth'

export const Authentication = () => {
  const token = useSelector((state: RootState) => state.auth.token)

  const [trigger, data] = useLazyPostAPITokenQuery()

  const params = new URLSearchParams({
    client_id: 'ddaf758c62618e0fe264',
    scope: 'public_repo',
  })

  const handleLoginClick = () => {
    // const url = `https://github.com/login/oauth/authorize?${params.toString()}`
    const url = 'http://localhost:5173/authorized?code=123'

    const loginWindow = window.open(
      url,
      'Authorize Octotread',
      'location=yes,height=570,width=520,scrollbars=yes,status=yes',
    )

    loginWindow?.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return
      const { code } = event.data

      if (code) {
        loginWindow.close()
        trigger(code)
      }
    })
  }

  return (
    <Stack>
      <Input
        label='Set yopur GitHub token'
        placeholder='Token'
        tooltipText='GitHub access tokens allow you to use the GitHub API.'
        value={token}
      />

      <Typography>
        Create your token{' '}
        <Link href='https://github.com/settings/tokens/new?scopes=public_repo&description=octotread'>
          here
        </Link>
      </Typography>

      <Button variant='contained' onClick={handleLoginClick}>
        Login
      </Button>
    </Stack>
  )
}

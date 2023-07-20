import { Stack, Typography } from '@mui/material'
import { useEffect } from 'react'

export const Authorized = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (code) {
      setTimeout(() => {
        window.opener?.postMessage({ code }, window.location.origin)
      }, 3000)
    }
  }, [])

  return (
    <Stack direction='column' alignItems='center' spacing={2} mt={15} px={3}>
      <Typography variant='h4' sx={{ textAlign: 'center' }}>
        Successfully Authorized Octotread!
      </Typography>

      <Typography variant='body1'>This window will close automatically.</Typography>
    </Stack>
  )
}

import { Stack, Typography } from '@mui/material'

export function Toolbar() {
  return (
    <Stack direction='row' justifyContent='space-between' alignItems='center'>
      <Typography variant='h5'>Octotread</Typography>

      <Typography variant='h6'>Navbar</Typography>
    </Stack>
  )
}

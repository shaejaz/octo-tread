import { Outlet } from 'react-router-dom'
import { Toolbar } from './Toolbar'
import { Box, Button, Stack, useColorScheme, useTheme } from '@mui/material'

export function Main() {
  const { mode, setMode } = useColorScheme()
  const theme = useTheme()

  return (
    <Box bgcolor={theme.palette.background.default} minHeight='100%'>
      <Toolbar />

      <Stack direction='column' spacing={3} component='main' maxWidth='lg' m='auto'>
        <Box pt={4} pb={6}>
          <Button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>Change color</Button>
        </Box>
        <Outlet />
      </Stack>
    </Box>
  )
}

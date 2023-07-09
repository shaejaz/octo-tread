import { Outlet } from 'react-router-dom'
import { Toolbar } from './Toolbar'
import { Box, Stack, useTheme } from '@mui/material'

export function Main() {
  const theme = useTheme()

  return (
    <Box bgcolor={theme.palette.background.default} minHeight='100%'>
      <Toolbar />

      <Stack
        direction='column'
        spacing={3}
        component='main'
        maxWidth='lg'
        marginX='auto'
        marginTop={8}
        paddingBottom={4}
      >
        <Outlet />
      </Stack>
    </Box>
  )
}

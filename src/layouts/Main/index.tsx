import { Outlet } from 'react-router-dom'
import { Toolbar } from './Toolbar'
import { Box, Stack } from '@mui/material'
import { SearchFilters } from './SearchFilters'

export function Main() {
  return (
    <Box minHeight='100%'>
      <Toolbar />

      <Stack direction='column' spacing={3} component='main' maxWidth='lg' m='auto'>
        <Box pt={4} pb={6}>
          <SearchFilters />
        </Box>
        <Outlet />
      </Stack>
    </Box>
  )
}

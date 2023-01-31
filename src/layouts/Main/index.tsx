import { Outlet } from 'react-router-dom'
import { Toolbar } from './Toolbar'
import { Box } from '@mui/material'
import { SearchFilters } from './SearchFilters'

export function Main() {
  return (
    <>
      <Toolbar />

      <Box component='main' maxWidth='lg' m='auto' px={3} py={6}>
        <SearchFilters />
        <Outlet />
      </Box>
    </>
  )
}

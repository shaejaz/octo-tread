import { Outlet } from 'react-router-dom'
import { Toolbar } from './Toolbar'
import { Box } from '@mui/material'

export function Main() {
  return (
    <>
      <Toolbar />

      <Box component='main' maxWidth='lg' m='auto' px={3} py={6}>
        <Outlet />
      </Box>
    </>
  )
}

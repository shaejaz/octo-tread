import { Outlet } from 'react-router-dom'
import { Toolbar } from './Toolbar'
import { Box } from '@mui/material'

export function Main() {
  return (
    <>
      <Toolbar />

      <Box component={'main'} width={'full'} maxWidth={'6xl'} m={'auto'} px={6} py={8}>
        <Outlet />
      </Box>
    </>
  )
}

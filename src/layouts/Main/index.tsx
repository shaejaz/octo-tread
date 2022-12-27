import React from 'react'
import { Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { Toolbar } from './Toolbar'

export function Main (): JSX.Element {
  return (
    <>
      <Toolbar />

      <Box as={'main'} width={'full'} maxW={'6xl'} margin={'auto'} px={6} py={8}>
        <Outlet />
      </Box>
    </>
  )
}

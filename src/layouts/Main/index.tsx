import { Outlet } from 'react-router-dom'
import { Toolbar } from './Toolbar'
import { Box, Stack, useTheme } from '@mui/material'
import { useWindowScrollPosition } from 'hooks/useWindowScrollPosition'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setScrolledDown } from '@octotread/services/ui'

export function Main() {
  const theme = useTheme()
  const dispatch = useDispatch()

  const scroll = useWindowScrollPosition()

  useEffect(() => {
    if (scroll > 100) {
      dispatch(setScrolledDown(true))
    } else {
      dispatch(setScrolledDown(false))
    }
  }, [dispatch, scroll])

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
        px={3}
        pb={4}
      >
        <Outlet />
      </Stack>
    </Box>
  )
}

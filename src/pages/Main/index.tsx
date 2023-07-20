import { Toolbar } from '@octotread/components/Toolbar'
import { Box, Button, Divider, Stack, useTheme } from '@mui/material'
import { useWindowScrollPosition } from 'hooks/useWindowScrollPosition'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setScrolledDown } from '@octotread/services/ui'
import { Authentication } from '@octotread/components/Authentication'
import { Loading } from '@octotread/components/Loading'
import { RepoGroup } from '@octotread/components/RepoGroup'
import { setDatesToFetch, loadNextDateRange } from '@octotread/services/search-query'
import { getUnixTime, subWeeks } from 'date-fns'
import { RootState } from '@octotread/services/store'
import { Error } from '@octotread/components/Error'

export function Main() {
  const theme = useTheme()
  const dispatch = useDispatch()

  const repos = useSelector((state: RootState) => state.searchquery.repositories)

  const token = useSelector((state: RootState) => state.auth.token)
  const oauth = useSelector((state: RootState) => state.auth.oauthToken)

  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    if (token === '' && oauth === '') {
      setAuthenticated(false)
    } else {
      setAuthenticated(true)
    }
  }, [token, oauth])

  useEffect(() => {
    if (authenticated) {
      dispatch(
        setDatesToFetch([
          {
            end: getUnixTime(new Date()),
            start: getUnixTime(subWeeks(new Date(), 1)),
          },
        ]),
      )
    }
  }, [authenticated, dispatch])

  const scroll = useWindowScrollPosition()

  useEffect(() => {
    if (scroll > 100) {
      dispatch(setScrolledDown(true))
    } else {
      dispatch(setScrolledDown(false))
    }
  }, [dispatch, scroll])

  useEffect(() => {
    if (authenticated) {
      dispatch(
        setDatesToFetch([
          {
            end: getUnixTime(new Date()),
            start: getUnixTime(subWeeks(new Date(), 1)),
          },
        ]),
      )
    }
  }, [authenticated, dispatch])

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
        <Stack direction='column' alignItems='center' spacing={5}>
          {authenticated && (
            <Stack direction='column' spacing={8} width='100%'>
              {repos.data.map((i, idx) => (
                // TODO: fix all key props
                <>
                  <RepoGroup key={idx} repoGroup={i} />

                  {idx !== repos.data.length - 1 && (
                    <Divider sx={{ width: '80%', alignSelf: 'center', mx: 'auto' }} />
                  )}
                </>
              ))}
            </Stack>
          )}

          {(repos.state === 'loading' || authenticated === null) && <Loading />}

          {repos.state === 'error' && authenticated && (
            <Error message='Error in fetching repositories' />
          )}

          {authenticated === false && repos.state !== 'loading' && <Authentication />}

          {repos.data.length > 0 && repos.state === 'done' && authenticated && (
            <Button
              variant='contained'
              onClick={() => dispatch(loadNextDateRange())}
              sx={{ px: 3 }}
            >
              Load next
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  )
}

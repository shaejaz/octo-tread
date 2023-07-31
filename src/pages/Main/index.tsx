import { Toolbar } from '@octotread/components/Toolbar'
import { Box, Divider, Stack, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepoGroup } from '@octotread/components/RepoGroup'
import { setDatesToFetch, loadNextDateRange } from '@octotread/services/search-query'
import { getUnixTime, subWeeks } from 'date-fns'
import { RootState } from '@octotread/services/store'
import { Authentication } from '@octotread/components/Authentication'

export function Main() {
  const theme = useTheme()
  const dispatch = useDispatch()

  const dates = useSelector((state: RootState) => state.searchquery.datesToFetch)
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

  const handleNextClick = () => {
    dispatch(loadNextDateRange())
  }

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
              {dates.map((i, idx) => (
                <>
                  <RepoGroup
                    key={i.start}
                    dateStartEnd={i}
                    handleNextClick={handleNextClick}
                    isLast={idx === dates.length - 1}
                  />

                  {idx !== dates.length - 1 && (
                    <Divider sx={{ width: '80%', alignSelf: 'center', mx: 'auto' }} />
                  )}
                </>
              ))}
              {/* TODO: fix all key props */}
            </Stack>
          )}

          {authenticated === false && <Authentication />}
        </Stack>
      </Stack>
    </Box>
  )
}

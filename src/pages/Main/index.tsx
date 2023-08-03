import { Toolbar } from '@octotread/components/Toolbar'
import { Box, Divider, Stack, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RepoGroup } from '@octotread/components/RepoGroup'
import { RootState } from '@octotread/services/store'
import { Authentication } from '@octotread/components/Authentication'
import { DateStartEnd } from '@octotread/models/dateStartEnd'
import { generateDateStartEnd, normalizeDateStartEnd } from '@octotread/utils/dates'

export function Main() {
  const theme = useTheme()
  const dispatch = useDispatch()

  const dateRange = useSelector((state: RootState) => state.searchquery.dateRange)
  const token = useSelector((state: RootState) => state.auth.token)
  const oauth = useSelector((state: RootState) => state.auth.oauthToken)

  const queryState = useSelector((state: RootState) => state.searchquery)

  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [dates, setDates] = useState<DateStartEnd[]>([])

  useEffect(() => {
    if (token === '' && oauth === '') {
      setAuthenticated(false)
    } else {
      setAuthenticated(true)
    }
  }, [token, oauth])

  useEffect(() => {
    if (authenticated) {
      setDates([generateDateStartEnd(queryState.dateRange)])
    }
  }, [authenticated, dispatch, queryState])

  const handleNextClick = () => {
    const last = dates[dates.length - 1]
    const d = generateDateStartEnd(dateRange, last)

    setDates((prev) => [...prev, normalizeDateStartEnd(d)])
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

import { Button, Divider, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { loadNextDateRange, setDatesToFetch } from '@octotread/services/search-query'
import { RootState } from '@octotread/services/store'
import { RepoGroup } from '@octotread/components/RepoGroup'
import { getUnixTime, subWeeks } from 'date-fns'
import { Loading } from '@octotread/components/Loading'
import { Error } from '@octotread/components/Error'
import { Authentication } from '../Authentication'

export function RepoLayouts() {
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

  return (
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
        <Button variant='contained' onClick={() => dispatch(loadNextDateRange())} sx={{ px: 3 }}>
          Load next
        </Button>
      )}
    </Stack>
  )
}

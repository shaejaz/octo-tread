import { Button, Divider, Stack } from '@mui/material'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { appendDateToFetch, loadNextDateRange } from '@octotread/services/search-query'
import { RootState } from '@octotread/services/store'
import { RepoGroup } from './RepoGroup'
import { getUnixTime, subWeeks } from 'date-fns'
import { Loading } from '@octotread/components/Loading'
import { Error } from '@octotread/components/Error'

export function RepoLayouts() {
  const dispatch = useDispatch()
  const repos = useSelector((state: RootState) => state.searchquery.repositories)

  useEffect(() => {
    dispatch(
      appendDateToFetch({
        end: getUnixTime(new Date()),
        start: getUnixTime(subWeeks(new Date(), 1)),
      }),
    )
  }, [dispatch])

  return (
    <Stack direction='column' alignItems='center' spacing={5}>
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

      {repos.state === 'loading' && <Loading />}

      {repos.state === 'error' && <Error message='Error in fetching repositories' />}

      {repos.data.length > 0 && repos.state === 'done' && (
        <Button variant='contained' onClick={() => dispatch(loadNextDateRange())} sx={{ px: 3 }}>
          Load next
        </Button>
      )}
    </Stack>
  )
}

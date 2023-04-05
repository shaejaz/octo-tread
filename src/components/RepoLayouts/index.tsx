import { Button, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { appendDateToFetch, loadNextDateRange } from '@octotread/services/search-query'
import { RootState } from '@octotread/services/store'
import { RepoGroup } from './RepoGroup'
import { getUnixTime, subWeeks } from 'date-fns'

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
    <>
      {repos.data.map((i, idx) => (
        // TODO: fix all key props
        <RepoGroup key={idx} repoGroup={i} showDateHeader={idx !== 0} />
      ))}

      {repos.state === 'loading' && <Typography variant='h3'>Loading!</Typography>}

      {repos.state === 'error' && <Typography variant='h3'>Error!</Typography>}

      {repos.data.length > 0 && (
        <Button onClick={() => dispatch(loadNextDateRange())}>Load next</Button>
      )}
    </>
  )
}

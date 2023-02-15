import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { searchApi } from '../../services/api/search'
import { appendDateToFetch, loadNextDateRange } from '../../services/search-query'
import { RootState } from '../../services/store'
import { RepoGroup } from './RepoGroup'
import { getUnixTime, subWeeks } from 'date-fns'

export function RepoLayouts() {
  const dispatch = useDispatch()
  const repos = useSelector((state: RootState) => state.searchquery.repositories)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (count > 0) return
    dispatch(
      appendDateToFetch({
        end: getUnixTime(new Date()),
        start: getUnixTime(subWeeks(new Date(), 1)),
      }),
    )
    setCount((s) => s + 1)
  }, [count])

  return (
    <>
      {repos.map((i, idx) => (
        <RepoGroup key={idx} repoGroup={i} />
      ))}

      {repos.length && <Button onClick={() => dispatch(loadNextDateRange())}>Load next</Button>}
    </>
  )
}

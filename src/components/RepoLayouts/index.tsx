import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLazySearchQuery, searchApi } from '../../services/api/search'
import { generateQuery, loadNextDateRange } from '../../services/search-query'
import { RootState } from '../../services/store'
import { RepoGroup } from './RepoGroup'

export function RepoLayouts() {
  const [trigger] = useLazySearchQuery()

  const query = useSelector((state: RootState) => state.searchquery.query)
  const pagination = useSelector((state: RootState) => state.searchquery.pagination)

  const result = searchApi.endpoints.search.useQueryState({
    q: query ?? '',
    startCursor: pagination.currentPageBase64,
  })

  const [repoGroups, setRepoGroups] = useState<RepoGroup[]>([])

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(generateQuery())
  }, [])

  useEffect(() => {
    if (!result.isSuccess) return
    if (!result.data) return

    setRepoGroups((results) => [
      ...results,
      { dateRange: { start: 0, end: 0 }, repos: result.data.search.nodes },
    ])
  }, [result.data])

  return (
    <>
      <Button
        onClick={() => {
          trigger({ q: query ?? '', startCursor: pagination.currentPageBase64 })
        }}
      >
        Fetch
      </Button>

      {repoGroups.map((i, idx) => (
        <RepoGroup key={idx} repoGroup={i} />
      ))}

      {repoGroups.length && (
        <Button onClick={() => dispatch(loadNextDateRange())}>Load next</Button>
      )}
    </>
  )
}

import { Button, Grid } from '@mui/material'
import { RepoCard } from './Card'
import { searchApi, useLazySearchQuery } from '../../../services/api/search'
import { useDispatch, useSelector } from 'react-redux'
import { generateQuery } from '../../../services/search-query'
import { RootState } from '../../../services/store'
import { useEffect } from 'react'

export function GridLayout() {
  const [trigger] = useLazySearchQuery()

  const query = useSelector((state: RootState) => state.searchquery.query)
  const pagination = useSelector((state: RootState) => state.searchquery.pagination)

  const result = searchApi.endpoints.search.useQueryState({
    q: query ?? '',
    startCursor: pagination.currentPageBase64,
  })

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(generateQuery())
  }, [])

  return (
    <>
      <Button
        onClick={() => {
          trigger({ q: query ?? '', startCursor: pagination.currentPageBase64 })
        }}
      >
        Fetch
      </Button>

      <Grid container spacing={4}>
        {result.data?.search.nodes.map((i, idx) => (
          <Grid key={idx} item xs={12} sm={6} md={4}>
            <RepoCard repo={i} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}

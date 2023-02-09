import { Stack, Pagination as MUIPagination } from '@mui/material'
import { searchApi } from '../../services/api/search'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../services/store'
import { setPagination } from '../../services/search-query'

export function Pagination() {
  const query = useSelector((state: RootState) => state.searchquery.query)
  const pagination = useSelector((state: RootState) => state.searchquery.pagination)
  const { data } = searchApi.endpoints.search.useQueryState({
    q: query ?? '',
    startCursor: pagination.currentPageBase64,
  })

  const dispatch = useDispatch()

  const numPages = useMemo(() => {
    if (data?.search?.repositoryCount) {
      return Math.ceil(data.search.repositoryCount / 5)
    }
    return 10
  }, [data])

  return (
    <Stack spacing={2}>
      <MUIPagination
        count={numPages}
        page={pagination.currentPage}
        onChange={(event: React.ChangeEvent<unknown>, value: number) => {
          dispatch(setPagination({ currentPage: value }))
        }}
      />
    </Stack>
  )
}

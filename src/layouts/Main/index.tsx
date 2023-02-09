import { Outlet } from 'react-router-dom'
import { Toolbar } from './Toolbar'
import { Box, Stack } from '@mui/material'
import { SearchFilters } from './SearchFilters'
import { Pagination } from './Pagination'
import { useSelector } from 'react-redux'
import { searchApi } from '../../services/api/search'
import { RootState } from '../../services/store'

export function Main() {
  const query = useSelector((state: RootState) => state.searchquery.query)
  const currentPage = useSelector(
    (state: RootState) => state.searchquery.pagination.currentPageBase64,
  )
  const { data } = searchApi.endpoints.search.useQueryState({
    q: query ?? '',
    startCursor: currentPage,
  })

  return (
    <Box minHeight='100%'>
      <Toolbar />

      <Stack direction='column' spacing={3} component='main' maxWidth='lg' m='auto' px={3} py={6}>
        <SearchFilters />
        <Outlet />

        {data && <Pagination />}
      </Stack>
    </Box>
  )
}

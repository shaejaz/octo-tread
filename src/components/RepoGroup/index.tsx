import { useEffect, useMemo, useState } from 'react'
import { GridLayout } from '@octotread/components/RepoGrid'
import { useSelector } from 'react-redux'
import { RootState } from '@octotread/services/store'
import { Box, Stack, useTheme } from '@mui/material'
import { SearchRepositoryResult, useLazySearchRepositoriesQuery } from '@octotread/services/api'
import { RepositoryGroup } from '@octotread/models/repositoryGroup'
import { getCursor } from '@octotread/utils/cursor'
import { useGenerateQueryString } from 'hooks/useGenerateQueryString'
import { RepoGroupDateHeader } from '../RepoGroupDateHeader'
import { Pagination } from '@octotread/components/Pagination'
import { Error } from '@octotread/components/Error'

interface Props {
  repoGroup: RepositoryGroup
  showDateHeader?: boolean
}

export function RepoGroup(props: Props) {
  const [page, setPage] = useState(1)
  const [trigger, result] = useLazySearchRepositoriesQuery()

  const theme = useTheme()

  const queryString = useGenerateQueryString(props.repoGroup.dateStartEnd)
  const itemsPerPage = useSelector((state: RootState) => state.searchquery.itemsPerPage)

  const numPages = useMemo(() => {
    if (!props.repoGroup.repos) return 0

    return Math.ceil(props.repoGroup.totalRepos / props.repoGroup.repos.length)
  }, [props.repoGroup])

  // TODO: switch to using paginated repos in state
  useEffect(() => {
    if (page === 1) return

    trigger({
      q: queryString,
      reposfirst: itemsPerPage,
      after: getCursor((page - 1) * itemsPerPage),
    })
    // otherwise trigger will be called whenever any group changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const handleChange = (value: number) => {
    setPage(value)
  }

  return (
    <Stack direction='column' alignItems='center' spacing={3} width='100%'>
      {(props.showDateHeader || props.showDateHeader === undefined) && (
        <RepoGroupDateHeader dateStartEnd={props.repoGroup.dateStartEnd} />
      )}

      {page !== 1 && result.isError && <Error message='Error in fetching repositories' />}

      {props.repoGroup.repos.length < 1 && !result.isError && (
        <Error message='No repositories found' iconProps={{ color: theme.palette.info.main }} />
      )}

      {(page === 1 || !result.isError) && props.repoGroup.repos.length > 0 && (
        <>
          <Box width='100%'>
            <GridLayout
              repos={
                page !== 1 && result.data
                  ? (result.data as unknown as SearchRepositoryResult).repositories
                  : props.repoGroup.repos
              }
              loading={result.isFetching}
            />
          </Box>

          <Box sx={{ marginX: 'auto' }}>
            <Pagination currentPage={page} numPages={numPages} handlePageChange={handleChange} />
          </Box>
        </>
      )}
    </Stack>
  )
}

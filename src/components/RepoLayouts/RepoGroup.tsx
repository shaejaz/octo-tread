import { useEffect, useMemo, useState } from 'react'
import { Pagination } from '@octotread/layouts/Main/Pagination'
import { GridLayout } from './Grid'
import { useSelector } from 'react-redux'
import { RootState } from '@octotread/services/store'
import { Typography } from '@mui/material'
import { SearchRepositoryResult, useLazySearchRepositoriesQuery } from '@octotread/services/api'
import { RepositoryGroup } from '@octotread/models/repositoryGroup'
import { getCursor } from '@octotread/utils/cursor'
import { useGenerateQueryString } from 'hooks/useGenerateQueryString'
import { RepoGroupDateHeader } from '../RepoGroupDateHeader'

interface Props {
  repoGroup: RepositoryGroup
  showDateHeader?: boolean
}

// TODO: Rename and fix structure of components
export function RepoGroup(props: Props) {
  const [page, setPage] = useState(1)
  const [trigger, result] = useLazySearchRepositoriesQuery()

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
    <>
      {(props.showDateHeader || props.showDateHeader === undefined) && (
        <RepoGroupDateHeader dateStartEnd={props.repoGroup.dateStartEnd} />
      )}

      {page !== 1 && result.isError && <Typography variant='h5'>Error!</Typography>}

      {(page === 1 || !result.isError) && (
        <GridLayout
          repos={
            page !== 1 && result.data
              ? (result.data as unknown as SearchRepositoryResult).repositories
              : props.repoGroup.repos
          }
          loading={result.isFetching}
        />
      )}
      <Pagination currentPage={page} numPages={numPages} handlePageChange={handleChange} />
    </>
  )
}

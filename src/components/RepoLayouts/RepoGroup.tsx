import { useEffect, useMemo, useState } from 'react'
import { Pagination } from '@octotread/layouts/Main/Pagination'
import { GridLayout } from './Grid'
import { useSelector } from 'react-redux'
import { RootState } from '@octotread/services/store'
import { Typography } from '@mui/material'
import { format, fromUnixTime } from 'date-fns'
import { SearchRepositoryResult, useLazySearchRepositoriesQuery } from '@octotread/services/api'
import { RepositoryGroup } from '@octotread/models/repositoryGroup'
import { getCursor } from '@octotread/utils/cursor'
import { useGenerateQueryString } from 'hooks/useGenerateQueryString'

interface Props {
  repoGroup: RepositoryGroup
}

// TODO: Rename and fix structure of components
export function RepoGroup(props: Props) {
  const [page, setPage] = useState(1)
  const [trigger, result] = useLazySearchRepositoriesQuery()

  const queryString = useGenerateQueryString(props.repoGroup.dateStartEnd)
  const itemsPerPage = useSelector((state: RootState) => state.searchquery.itemsPerPage)

  const header = useMemo(() => {
    const start = format(fromUnixTime(props.repoGroup.dateStartEnd.end), 'do MMM, yyyy')
    const end = format(fromUnixTime(props.repoGroup.dateStartEnd.start), 'do MMM, yyyy')

    return `${end} - ${start}`
  }, [props.repoGroup.dateStartEnd])

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
      <Typography variant='h4'>{header}</Typography>

      {page !== 1 && result.isFetching && <Typography variant='h5'>Loading!</Typography>}

      {page !== 1 && result.isError && <Typography variant='h5'>Error!</Typography>}

      {(page === 1 || !(result.isError || result.isFetching)) && (
        <GridLayout
          repos={
            page !== 1 && result.data
              ? (result.data as unknown as SearchRepositoryResult).repositories
              : props.repoGroup.repos
          }
        />
      )}
      <Pagination currentPage={page} numPages={numPages} handlePageChange={handleChange} />
    </>
  )
}

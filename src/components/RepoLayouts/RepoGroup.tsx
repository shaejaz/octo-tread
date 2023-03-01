import { useEffect, useMemo, useState } from 'react'
import { Pagination } from '@octotread/layouts/Main/Pagination'
import { GridLayout } from './Grid'
import { useSelector } from 'react-redux'
import { RootState } from '@octotread/services/store'
import { Typography } from '@mui/material'
import { format, fromUnixTime } from 'date-fns'
import { SearchRepositoryResult, useLazySearchRepositoriesQuery } from '@octotread/services/api'
import { RepositoryGroup } from '@octotread/models/repositoryGroup'
import { generateQueryFn } from '@octotread/utils/generateQuery'

interface Props {
  repoGroup: RepositoryGroup
}

function getCursor(i: number) {
  return btoa(`cursor:${i}`)
}

// TODO: Rename and fix structure of components
export function RepoGroup(props: Props) {
  const [page, setPage] = useState(1)
  const [trigger, result] = useLazySearchRepositoriesQuery()

  const header = useMemo(() => {
    const start = format(fromUnixTime(props.repoGroup.dateRange.end), 'do MMM, yyyy')
    const end = format(fromUnixTime(props.repoGroup.dateRange.start), 'do MMM, yyyy')

    return `${end} - ${start}`
  }, [props.repoGroup.dateRange])

  const numPages = useMemo(() => {
    if (!props.repoGroup.repos) return 0

    return Math.ceil(props.repoGroup.totalRepos / props.repoGroup.repos.length)
  }, [props.repoGroup])

  const handleChange = (value: number) => {
    setPage(value)
  }

  const state = useSelector((state: RootState) => state.searchquery)

  useEffect(() => {
    if (page === 1) return

    const q = generateQueryFn(state, props.repoGroup.dateRange)
    trigger({
      q: q,
      reposfirst: state.itemsPerPage,
      after: getCursor((page - 1) * state.itemsPerPage),
    })
  }, [page, state.itemsPerPage, props.repoGroup.dateRange, state, trigger])

  return (
    <>
      <Typography variant='h4'>{header}</Typography>

      <GridLayout
        repos={
          page !== 1 && result.data
            ? (result.data as unknown as SearchRepositoryResult).repositories
            : props.repoGroup.repos
        }
      />
      <Pagination currentPage={page} numPages={numPages} handlePageChange={handleChange} />
    </>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Pagination } from '../../layouts/Main/Pagination'
import { GridLayout } from './Grid'
import { RepoGroup as RepoGroupModel } from '../../services/search-query'
import { useSelector } from 'react-redux'
import { RootState } from '../../services/store'
import { Typography } from '@mui/material'
import { format, fromUnixTime } from 'date-fns'
import { useLazySearchRepositoriesQuery } from '../../services/api/graphql/SearchRepositories.generated'

interface Props {
  repoGroup: RepoGroupModel
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
    trigger({
      obj: state,
      dateRange: props.repoGroup.dateRange,
      startCursor: getCursor((page - 1) * state.itemsPerPage),
    })
  }, [page, state.itemsPerPage])

  return (
    <>
      <Typography variant='h4'>{header}</Typography>

      <GridLayout
        repos={
          page !== 1 && result.data?.search.nodes ? result.data.search.nodes : props.repoGroup.repos
        }
      />
      <Pagination currentPage={page} numPages={numPages} handlePageChange={handleChange} />
    </>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Pagination } from '../../layouts/Main/Pagination'
import { useLazySearchQuery } from '../../services/api/search'
import { GridLayout } from './Grid'
import { RepoGroup as RepoGroupModel } from '../../services/search-query'
import { useSelector } from 'react-redux'
import { RootState } from '../../services/store'

interface Props {
  repoGroup: RepoGroupModel
}

function getCursor(i: number) {
  return btoa(`cursor:${i}`)
}

export function RepoGroup(props: Props) {
  const [page, setPage] = useState(1)
  const [trigger, result] = useLazySearchQuery()

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
      <GridLayout
        repos={
          page !== 1 && result.data?.search.nodes ? result.data.search.nodes : props.repoGroup.repos
        }
      />
      <Pagination currentPage={page} numPages={numPages} handlePageChange={handleChange} />
    </>
  )
}

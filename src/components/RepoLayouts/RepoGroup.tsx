import { useMemo } from 'react'
import { Pagination } from '../../layouts/Main/Pagination'
import { Repository, useSearchQuery } from '../../services/api/search'
import { GridLayout } from './Grid'
import { DateRangeObj, RepoGroup as RepoGroupModel } from '../../services/search-query'
import { useSelector } from 'react-redux'
import { RootState } from '../../services/store'

interface Props {
  repoGroup: RepoGroupModel
  // handlePageChange: (i: number) => void
}

export function RepoGroup(props: Props) {
  // const numPages = useMemo(() => {
  //   if (!props.repoGroup.repos) return 0

  //   return Math.ceil(props.repoGroup.totalRepos / props.repoGroup.repos.length)
  // }, [props.repoGroup])

  return (
    <>
      {/* {isLoading && <span>Loading!</span>} */}
      {/* {data && <GridLayout repos={data?.search.nodes} />} */}
      <GridLayout repos={props.repoGroup.repos} />
      {/* <Pagination currentPage={1} numPages={numPages} handlePageChange={props.handlePageChange} /> */}
    </>
  )
}

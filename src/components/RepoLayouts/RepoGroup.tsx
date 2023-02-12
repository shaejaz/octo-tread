import { Pagination } from '../../layouts/Main/Pagination'
import { Repository } from '../../services/api/search'
import { GridLayout } from './Grid'

export interface RepoGroup {
  dateRange: {
    start: number
    end: number
  }
  repos: Repository[]
}

interface Props {
  repoGroup: RepoGroup
}

export function RepoGroup(props: Props) {
  return (
    <>
      <GridLayout repos={props.repoGroup.repos} />
      <Pagination />
    </>
  )
}

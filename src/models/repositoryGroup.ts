import { Repository } from './repository'

export interface RepositoryGroup {
  dateRange: {
    start: number
    end: number
  }
  repos: Repository[]
  totalRepos: number
}

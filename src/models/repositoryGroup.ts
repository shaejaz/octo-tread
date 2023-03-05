import { DateStartEnd } from './dateStartEnd'
import { Repository } from './repository'

export interface RepositoryGroup {
  dateStartEnd: DateStartEnd
  repos: Repository[]
  totalRepos: number
}

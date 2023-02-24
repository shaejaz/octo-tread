import { Grid } from '@mui/material'
import { RepoCard } from './Card'
// TODO: add base paths in tsconfig
import { QueryRepository } from '../../../services/search-query'

interface Props {
  repos: QueryRepository[]
}

export function GridLayout(props: Props) {
  return (
    <Grid container spacing={4}>
      {props.repos.map((i, idx) => (
        <Grid key={idx} item xs={12} sm={6} md={4}>
          <RepoCard repo={i} />
        </Grid>
      ))}
    </Grid>
  )
}

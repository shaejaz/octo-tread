import { RepoCard } from './Card'
import { Repository } from '@octotread/models/repository'
import Grid from '@mui/material/Unstable_Grid2'

interface Props {
  repos: Repository[]
  loading: boolean
}

export function GridLayout(props: Props) {
  return (
    <Grid container spacing={{ xs: 2, md: 4 }}>
      {props.repos.map((i, idx) => (
        <Grid key={idx} xs={12} sm={6} md={4}>
          <RepoCard repo={i} loading={props.loading} />
        </Grid>
      ))}
    </Grid>
  )
}

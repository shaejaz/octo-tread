import { Grid } from '@mui/material'
import { RepoCard } from './Card'
import { Repository } from './Repository'

export function GridLayout(props: { repos: Repository[] }) {
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

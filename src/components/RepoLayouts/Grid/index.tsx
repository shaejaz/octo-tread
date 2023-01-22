import { Grid, Typography } from '@mui/material'
import { RepoCard } from './Card'
import { useSearchQuery } from '../../../services/api/search'

export function GridLayout() {
  const { data, isLoading } = useSearchQuery(null)

  return (
    <>
      {isLoading && data ? (
        <Typography>Loading</Typography>
      ) : (
        <Grid container spacing={4}>
          {data?.search.nodes.map((i, idx) => (
            <Grid key={idx} item xs={12} sm={6} md={4}>
              <RepoCard repo={i} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  )
}

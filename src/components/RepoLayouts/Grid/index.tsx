import { Stack } from '@mui/material'
import Grid from '@mui/material/Grid'

interface Repository {
  id: string
  name: string
  description: string
  author: string
  language: string
  stars: number
}

export function GridLayout(props: { repos: Repository[] }) {
  return (
    <Grid container spacing={2}>
      {props.repos.map((i, idx) => (
        <Grid key={idx} item xs={12} sm={6} md={4}>
          <Stack>
            <span>{i.name}</span>
            <span>{i.author}</span>
            <span>{i.description}</span>
            <span>{i.language}</span>
            <span>{i.stars}</span>
          </Stack>
        </Grid>
      ))}
    </Grid>
  )
}

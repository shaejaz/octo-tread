import { Card, CardContent, CardProps, Typography } from '@mui/material'
import { Repository } from './Repository'

interface RepoCardProps extends CardProps {
  repo: Repository
}

export function RepoCard(props: RepoCardProps) {
  const { repo, ...cardProps } = props

  return (
    <Card sx={{ height: '15rem' }} {...cardProps}>
      <CardContent>
        <Typography>{repo.name}</Typography>
        <Typography>{repo.author}</Typography>
        <Typography>{repo.description}</Typography>
        <Typography>{repo.language}</Typography>
        <Typography>{repo.stars}</Typography>
      </CardContent>
    </Card>
  )
}

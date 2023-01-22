import { Card, CardContent, CardProps, Typography } from '@mui/material'
import { Repository } from '../../../services/search'

interface RepoCardProps extends CardProps {
  repo: Repository
}

export function RepoCard(props: RepoCardProps) {
  const { repo, ...cardProps } = props

  return (
    <Card sx={{ height: '15rem' }} {...cardProps}>
      <CardContent>
        <Typography>{repo.name}</Typography>
        <Typography>{repo.description}</Typography>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardProps, Typography } from '@mui/material'
import { Repository } from '@octotread/services/api'

interface RepoCardProps extends CardProps {
  repo: Repository
}

export function RepoCard(props: RepoCardProps) {
  const { repo, ...cardProps } = props

  return (
    <Card sx={{ height: '15rem' }} {...cardProps}>
      <CardContent>
        <Typography>{repo.name}</Typography>
        <Typography>{repo.owner.login}</Typography>
        <Typography>{repo.description}</Typography>
        <Typography>Stars: {repo.stargazerCount}</Typography>
        <Typography>
          {repo.languages?.nodes?.reduce((a, c) => (c?.name ? a + ' ' + c.name : ''), '')}
        </Typography>
      </CardContent>
    </Card>
  )
}

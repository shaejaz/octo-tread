import { Card, CardContent, CardProps, Typography } from '@mui/material'
import { SearchRepositoryResult } from '../../../services/api'

type Element<Type> = Type extends Array<infer Item> ? Item : Type

interface RepoCardProps extends CardProps {
  repo: Element<SearchRepositoryResult['repositories']>
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
        <Typography>{repo.languages?.nodes?.reduce((a, c) => a + ' ' + c.name, '')}</Typography>
      </CardContent>
    </Card>
  )
}

import { Avatar, Box, Card, CardContent, CardProps, Chip, Stack, Typography } from '@mui/material'
import { LanguageChip } from '@octotread/components/LanguageChip'
import { StarGazersChip } from '@octotread/components/StarGazersChip'
import { TruncatedText } from '@octotread/components/TruncatedText'
import { Repository } from '@octotread/models/repository'

interface RepoCardProps extends CardProps {
  repo: Repository
}

export function RepoCard(props: RepoCardProps) {
  const { repo, ...cardProps } = props

  return (
    <Card sx={{ height: '16rem' }} {...cardProps}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* TODO: change layout for smaller screens */}
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Stack direction='column'>
            <Typography variant='h6'>{repo.name}</Typography>
            <Typography variant='subtitle2'>{repo.owner.login}</Typography>
          </Stack>

          <Avatar sx={{ width: 40, height: 40 }} src={repo.owner.avatarUrl} />
        </Stack>

        <Box py={2} sx={{ flex: '1 1 100%' }}>
          <TruncatedText lines={4}>{repo.description}</TruncatedText>
        </Box>

        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <StarGazersChip stars={repo.stargazerCount} />

          {/* TODO: add color borders and expansion */}
          <Stack direction='row' spacing={1}>
            {repo.languages?.nodes?.length !== undefined && repo.languages?.nodes?.length > 0 && (
              <LanguageChip
                name={repo.languages?.nodes[0]?.name || ''}
                languageColor={repo.languages?.nodes[0]?.color || ''}
              />
            )}

            {repo.languages?.nodes?.length !== undefined && repo.languages?.nodes?.length > 1 && (
              <Chip label='...' size='small' sx={{ px: 0.5 }} />
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

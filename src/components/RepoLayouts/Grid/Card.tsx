import {
  Avatar,
  Box,
  Chip,
  Paper,
  PaperProps,
  Stack,
  Tooltip,
  Typography,
  styled,
} from '@mui/material'
import { LanguageChip } from '@octotread/components/LanguageChip'
import { StarGazersChip } from '@octotread/components/StarGazersChip'
import { TruncatedText } from '@octotread/components/TruncatedText'
import { Repository } from '@octotread/models/repository'
import { useCallback, useState } from 'react'

interface RepoCardProps extends PaperProps {
  repo: Repository
}

const RepoPaper = styled(Paper)(({ theme }) => ({
  height: '16rem',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  paddingInline: theme.spacing(2),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(3),
}))

export function RepoCard(props: RepoCardProps) {
  const { repo, ...paperProps } = props

  // TODO: possibly convert conditional tooltip to a hook + component
  const [showHeaderTooltip, setShowHeaderTooltip] = useState(false)
  const [showSubHeaderTooltip, setShowSubHeaderTooltip] = useState(false)

  const headerRef = useCallback((node: HTMLElement) => {
    if (node !== null) {
      setShowHeaderTooltip(node.scrollWidth > node.offsetWidth)
    }
  }, [])

  const subHeaderRef = useCallback((node: HTMLElement) => {
    if (node !== null) {
      setShowSubHeaderTooltip(node.scrollWidth > node.offsetWidth)
    }
  }, [])

  return (
    <RepoPaper {...paperProps}>
      {/* TODO: change layout for smaller screens */}
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Stack direction='column' pr={2} minWidth={0} flex={'1'}>
          <Tooltip
            title={repo.name}
            placement='top'
            disableHoverListener={!showHeaderTooltip}
            disableTouchListener={!showHeaderTooltip}
          >
            <Typography variant='h6' noWrap ref={headerRef}>
              {repo.name}
            </Typography>
          </Tooltip>
          <Tooltip
            title={repo.owner.login}
            placement='bottom'
            disableHoverListener={!showSubHeaderTooltip}
            disableTouchListener={!showSubHeaderTooltip}
          >
            <Typography variant='subtitle2' noWrap ref={subHeaderRef}>
              {repo.owner.login}
            </Typography>
          </Tooltip>
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
    </RepoPaper>
  )
}

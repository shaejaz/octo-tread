import { Icon } from '@iconify/react'
import {
  Avatar,
  Box,
  Chip,
  Fade,
  Link,
  Paper,
  PaperProps,
  Stack,
  Tooltip,
  Typography,
  styled,
  useTheme,
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
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[4],
  },
}))

export function RepoCard(props: RepoCardProps) {
  const { repo, ...paperProps } = props

  // TODO: possibly convert conditional tooltip to a hook + component
  const [showHeaderTooltip, setShowHeaderTooltip] = useState(false)
  const [showSubHeaderTooltip, setShowSubHeaderTooltip] = useState(false)
  const [showOpenIcon, setShowOpenIcon] = useState(false)

  const theme = useTheme()

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
            <Stack
              direction='row'
              alignItems='baseline'
              spacing={1}
              sx={{ ':hover': { cursor: 'pointer' } }}
            >
              <Typography
                variant='h6'
                noWrap
                ref={headerRef}
                onMouseEnter={() => setShowOpenIcon(true)}
                onMouseLeave={() => setShowOpenIcon(false)}
              >
                <Link href={repo.url} target='_blank' rel='noreferrer' underline='none'>
                  {repo.name}
                </Link>
              </Typography>

              <Box sx={{ flex: '0 0 auto' }}>
                <Fade in={showOpenIcon}>
                  <Icon icon='majesticons:open' color={theme.palette.primary.main} />
                </Fade>
              </Box>
            </Stack>
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

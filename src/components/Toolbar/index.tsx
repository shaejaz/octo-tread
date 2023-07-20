import {
  AppBar,
  Avatar,
  Container,
  IconButton,
  Link,
  Toolbar as MuiToolbar,
  Stack,
  Typography,
  containerClasses,
  debounce,
  styled,
  typographyClasses,
  useTheme,
} from '@mui/material'
import { Icon } from '@iconify/react'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { SearchFilters } from '@octotread/components/SearchFilters'
import { ThemeSwitcher } from '@octotread/components/ThemeSwitcher'
import { setToolbarHovered } from '@octotread/services/ui'
import { AuthenticationDialog } from '@octotread/components/AuthenticationDialog'

const OctotreadAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  backgroundImage: 'none',
  paddingTop: theme.spacing(2),
  paddingInline: theme.spacing(3),
  boxShadow: 'none',
  transition: 'none',
  [`& .${containerClasses.root}`]: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
    [`& .${typographyClasses.root}`]: {
      color: theme.palette.primary.contrastText,
    },
  },
}))

export function Toolbar() {
  const dispatch = useDispatch()
  const theme = useTheme()

  const [modalOpen, setModalOpen] = useState(false)

  const handleModalOpen = () => {
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }

  const debouncedSetToolbarHovered = useMemo(
    () =>
      debounce((hovered: boolean) => {
        dispatch(setToolbarHovered(hovered))
      }, 250),
    [dispatch],
  )

  const handleMouseEnter = () => {
    debouncedSetToolbarHovered(true)
  }

  const handleMouseLeave = () => {
    debouncedSetToolbarHovered(false)
  }

  return (
    <OctotreadAppBar position='sticky'>
      <Container
        maxWidth='lg'
        sx={{ zIndex: 1 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <MuiToolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Typography variant='h5'>Octotread</Typography>

          <Stack direction='row' alignItems='center' spacing={2}>
            <ThemeSwitcher />

            <IconButton size='small'>
              <Link href='https://github.com/shaejaz/octo-tread' target='_blank' rel='noreferrer'>
                <Avatar
                  variant='rounded'
                  sx={{
                    bgcolor: theme.palette.grey['700'],
                    boxShadow: theme.shadows['5'],
                  }}
                >
                  <Icon icon='mdi:github' color={theme.palette.primary.dark} />
                </Avatar>
              </Link>
            </IconButton>

            <IconButton size='small' onClick={handleModalOpen}>
              <Avatar
                variant='rounded'
                sx={{
                  bgcolor: theme.palette.grey['700'],
                  boxShadow: theme.shadows['5'],
                }}
              >
                <Icon icon='material-symbols:key-outline' color={theme.palette.primary.dark} />
              </Avatar>
            </IconButton>
          </Stack>
        </MuiToolbar>
      </Container>

      <AuthenticationDialog
        open={modalOpen}
        onClose={handleModalClose}
        handleModalClose={handleModalClose}
      />

      <SearchFilters maxWidth='lg' width='100%' marginX='auto' />
    </OctotreadAppBar>
  )
}

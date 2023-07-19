import {
  AppBar,
  Avatar,
  Badge,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar as MuiToolbar,
  Stack,
  Typography,
  containerClasses,
  debounce,
  styled,
  typographyClasses,
} from '@mui/material'
import { Icon } from '@iconify/react'
import { ReactEventHandler, useMemo, useState } from 'react'
import { InferType, object, string } from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { setToken } from '@octotread/services/auth'
import { RootState } from '@octotread/services/store'
import type {} from '@mui/material/themeCssVarsAugmentation'
import { SearchFilters } from './SearchFilters'
import { ThemeSwitcher } from '@octotread/components/ThemeSwitcher'
import { setToolbarHovered } from '@octotread/services/ui'
import { AuthenticationDialog } from '@octotread/components/AuthenticationDialog'

const OctotreadAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.vars.palette.background.default,
  backgroundImage: 'none',
  paddingTop: theme.spacing(2),
  paddingInline: theme.spacing(3),
  boxShadow: 'none',
  transition: 'none',
  [`& .${containerClasses.root}`]: {
    backgroundColor: theme.vars.palette.primary.main,
    // backgroundImage: theme.vars.overlays[1],
    borderRadius: theme.vars.shape.borderRadius,
    [`& .${typographyClasses.root}`]: {
      color: theme.vars.palette.primary.contrastText,
    },
  },
}))

const accessTokenSchema = object({
  token: string().required('Token needs to be set'),
})

export function Toolbar() {
  const dispatch = useDispatch()
  const isDefault = true

  const [menuAnchorEl, setMenuAnchorEl] = useState<Element | null>(null)
  const menuOpen = Boolean(menuAnchorEl)

  const [modalOpen, setModalOpen] = useState(false)

  const avatarComponent = () => (
    <Avatar variant='rounded'>
      <Icon icon='material-symbols:key-outline' />
    </Avatar>
  )

  const token = useSelector((state: RootState) => state.auth.token)

  const {
    control,
    formState: { isValid },
    getValues,
  } = useForm<InferType<typeof accessTokenSchema>>({
    resolver: yupResolver(accessTokenSchema),
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      token: token,
    },
  })

  const handleAvatarButtonClick: ReactEventHandler = (event) => {
    setMenuAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

  const handleModalOpen = () => {
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }

  const handleModalSave = () => {
    dispatch(setToken(getValues().token))
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

            <IconButton size='small' onClick={handleAvatarButtonClick}>
              {isDefault ? (
                <Badge
                  overlap='circular'
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Stack
                      alignItems='center'
                      justifyContent='center'
                      borderRadius='100%'
                      sx={{ bgcolor: '#e3102c', m: 'auto' }}
                    >
                      <Icon
                        icon='material-symbols:error-circle-rounded-outline'
                        color='#fff'
                        width='12'
                        height='12'
                      />
                    </Stack>
                  }
                >
                  {avatarComponent()}
                </Badge>
              ) : (
                avatarComponent()
              )}
            </IconButton>
          </Stack>
        </MuiToolbar>
      </Container>

      {/* TODO: Move to separate component */}
      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        onClick={handleMenuClose}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleModalOpen}>Set access token</MenuItem>
      </Menu>

      <AuthenticationDialog
        open={modalOpen}
        onClose={handleMenuClose}
        handleModalClose={handleModalClose}
      />

      <SearchFilters maxWidth='lg' width='100%' marginX='auto' />
    </OctotreadAppBar>
  )
}

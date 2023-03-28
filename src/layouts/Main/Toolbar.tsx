import {
  AppBar,
  Avatar,
  Badge,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Toolbar as MuiToolbar,
  Stack,
  TextField,
  Typography,
  styled,
} from '@mui/material'
import { Icon } from '@iconify/react'
import { useIsDefaultTokenSet } from 'hooks/useIsDefaultToken'
import { ReactEventHandler, useState } from 'react'
import { InferType, object, string } from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { setToken } from '@octotread/services/auth'
import { RootState } from '@octotread/services/store'

const OctotreadAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  paddingTop: theme.spacing(2),
  boxShadow: 'none',
  transition: 'none',
  '& .MuiContainer-root': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
  },
}))

const accessTokenSchema = object({
  token: string().required('Token needs to be set'),
})

export function Toolbar() {
  const dispatch = useDispatch()
  const isDefault = useIsDefaultTokenSet()

  const [menuAnchorEl, setMenuAnchorEl] = useState<Element | null>(null)
  const menuOpen = Boolean(menuAnchorEl)

  const [modalOpen, setModalOpen] = useState(false)

  const avatarComponent = () => (
    <Avatar>
      <Icon icon='mdi:ticket-outline' />
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

  return (
    <OctotreadAppBar position='sticky'>
      <Container maxWidth='lg'>
        <MuiToolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Typography variant='h5'>Octotread</Typography>

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

      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>
          <Typography>Set your GitHub personal access token</Typography>
        </DialogTitle>

        <DialogContent>
          <Controller
            control={control}
            name='token'
            render={({ field, fieldState }) => (
              <TextField
                placeholder='Personal Access Token'
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                {...field}
              />
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button onClick={handleModalSave} disabled={!isValid}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </OctotreadAppBar>
  )
}

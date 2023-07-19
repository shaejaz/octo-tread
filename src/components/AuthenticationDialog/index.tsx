import { Dialog, DialogContent, DialogProps, IconButton } from '@mui/material'
import { Authentication } from '../Authentication'
import { Icon } from '@iconify/react'

interface Props extends DialogProps {
  handleModalClose: () => void
}

export const AuthenticationDialog = (props: Props) => {
  const { handleModalClose, ...dialogProps } = props

  return (
    <Dialog {...dialogProps} onClose={handleModalClose}>
      <DialogContent>
        <Authentication />
      </DialogContent>

      <IconButton sx={{ position: 'absolute', right: 2, top: 2 }} onClick={handleModalClose}>
        <Icon icon='ic:round-close' />
      </IconButton>
    </Dialog>
  )
}

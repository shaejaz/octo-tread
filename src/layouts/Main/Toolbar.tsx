import { AppBar, Container, Toolbar as MuiToolbar, Typography } from '@mui/material'

export function Toolbar() {
  return (
    <AppBar position='sticky'>
      <Container maxWidth='lg'>
        <MuiToolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Typography variant='h5'>Octotread</Typography>

          <Typography variant='h6'>Navbar</Typography>
        </MuiToolbar>
      </Container>
    </AppBar>
  )
}

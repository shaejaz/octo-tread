import { Components, Theme } from '@mui/material'

export const paper: Components<Omit<Theme, 'components'>>['MuiPaper'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.text.primary,
    }),
  },
}

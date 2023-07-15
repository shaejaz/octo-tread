import { Components, Theme } from '@mui/material'

export const link: Components<Omit<Theme, 'components'>>['MuiLink'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.primaryText.primary,
    }),
  },
}

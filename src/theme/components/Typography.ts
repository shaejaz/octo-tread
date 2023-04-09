import { Components, Theme } from '@mui/material'

export const typography: Components<Omit<Theme, 'components'>>['MuiTypography'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.vars.palette.text.primary,
    }),
  },
}

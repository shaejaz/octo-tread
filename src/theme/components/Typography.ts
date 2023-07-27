import { Components, Theme } from '@mui/material'

export const typography: Components<Omit<Theme, 'components'>>['MuiTypography'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.text.primary,
    }),
  },
}

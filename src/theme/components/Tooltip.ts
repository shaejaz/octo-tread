import { Components, Theme } from '@mui/material'

export const tooltip: Components<Omit<Theme, 'components'>>['MuiTooltip'] = {
  styleOverrides: {
    tooltip: ({ theme }) => ({
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.grey[200],
    }),
    arrow: ({ theme }) => ({
      color: theme.palette.grey[200],
    }),
  },
  defaultProps: {
    arrow: true,
  },
}

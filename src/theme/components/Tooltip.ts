import { Components, Theme } from '@mui/material'

export const tooltip: Components<Omit<Theme, 'components'>>['MuiTooltip'] = {
  styleOverrides: {
    tooltip: ({ theme }) => ({
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.paper,
      border: `3px solid ${theme.palette.primary.main}`,
      boxShadow: theme.shadows[3],
    }),
    arrow: ({ theme }) => ({
      color: theme.palette.background.paper,
      fontSize: 18,
      '&::before': {
        border: `3px solid ${theme.palette.primary.main}`,
      },
    }),
  },
  defaultProps: {
    arrow: true,
  },
}

import { typography } from './Typography'
import { tooltip } from './Tooltip'
import { Components, Theme } from '@mui/material'

export const components: Components<Omit<Theme, 'components'>> = {
  MuiTooltip: tooltip,
  MuiTypography: typography,
}

import { components } from './components/index'
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { palette } from './palette'
import { typography } from './typography'

export const theme = extendTheme({
  cssVarPrefix: 'octt',
  colorSchemes: {
    light: {
      palette: palette,
    },
    dark: {
      palette: palette,
    },
  },
  typography: typography,
  shape: {
    borderRadius: 10,
  },
  components: components,
})

import { components } from './components/index'
import { PaletteColorOptions, experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { darkPalette, lightPalette } from './palette'
import { typography } from './typography'

// declare module '@mui/material/styles' {
//   interface Theme {
//     palette: {
//       gradient: PaletteColorOptions
//     }
//   }
//   interface PaletteOptions {
//     gradient?: PaletteColorOptions
//   }
// }

export const theme = extendTheme({
  cssVarPrefix: 'octt',
  colorSchemes: {
    light: {
      palette: lightPalette,
    },
    dark: {
      palette: darkPalette,
    },
  },
  typography: typography,
  shape: {
    borderRadius: 10,
  },
  components: components,
})

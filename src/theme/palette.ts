import { PaletteOptions } from '@mui/material'

const palette: PaletteOptions = {
  primary: {
    main: '#3c0c75',
  },
  secondary: {
    main: '#125271',
  },
  gradient: {
    main: 'linear-gradient(90deg, #3c0c75 10%, #125271 100%);',
  },
}

export const lightPalette: PaletteOptions = {
  ...palette,
  background: {
    default: '#f4f4f4',
  },
}

export const darkPalette: PaletteOptions = {
  ...palette,
}

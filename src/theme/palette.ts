import { PaletteOptions } from '@mui/material'

const palette: PaletteOptions = {
  primary: {
    main: '#3c0c75',
    contrastText: '#fff',
  },
  secondary: {
    main: '#125271',
  },
}

export const lightPalette: PaletteOptions = {
  ...palette,
  background: {
    default: '#f4f4f4',
  },
  primaryText: {
    primary: '#3c0c75',
  },
}

export const darkPalette: PaletteOptions = {
  ...palette,
  primaryText: {
    primary: '#C59FF4',
  },
}

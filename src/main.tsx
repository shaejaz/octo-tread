import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import router from './routes'
import { red } from '@mui/material/colors'
import { CssBaseline } from '@mui/material'
import { Provider } from 'react-redux'
import { store } from './services/store'

const theme = createTheme({
  palette: {
    primary: {
      main: red[500],
    },
  },
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CssBaseline />
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)

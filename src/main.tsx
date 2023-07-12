import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import { CssBaseline, Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material'
import { Provider } from 'react-redux'
import { store } from './services/store'
import { theme } from '@octotread/theme/index'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CssVarsProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </CssVarsProvider>
  </React.StrictMode>,
)

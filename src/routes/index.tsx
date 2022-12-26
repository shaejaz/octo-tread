import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Main } from '../layouts/Main'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/',
        element: <div>Hello world</div>
      }
    ]
  }
])

export default router

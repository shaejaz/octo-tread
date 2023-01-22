import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Main } from '../layouts/Main'
import { GridLayout } from '../components/RepoLayouts/Grid'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/',
        element: <GridLayout />,
      },
    ],
  },
])

export default router

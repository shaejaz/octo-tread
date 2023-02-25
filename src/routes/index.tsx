import { createBrowserRouter } from 'react-router-dom'
import { Main } from '@octotread/layouts/Main'
import { RepoLayouts } from '@octotread/components/RepoLayouts'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/',
        element: <RepoLayouts />,
      },
    ],
  },
])

export default router

import { createBrowserRouter } from 'react-router-dom'
import { Main } from '@octotread/layouts/Main'
import { RepoLayouts } from '@octotread/components/RepoLayouts'
import { Authorized } from '@octotread/layouts/Authorized'

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
  {
    path: '/authorized',
    element: <Authorized />,
  },
])

export default router

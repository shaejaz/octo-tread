import { createBrowserRouter } from 'react-router-dom'
import { Main } from '../layouts/Main'
import { RepoLayouts } from '../components/RepoLayouts'

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

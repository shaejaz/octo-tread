import { createBrowserRouter } from 'react-router-dom'
import { Main } from '@octotread/pages/Main'
import { Authorized } from '@octotread/pages/Authorized'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
  },
  {
    path: '/authorized',
    element: <Authorized />,
  },
])

export default router

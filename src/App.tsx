import { createBrowserRouter, RouterProvider } from 'react-router'
import DemoPage from '@/pages/DemoPage'
import NotFoundPage from '@/pages/NotFoundPage'
import PublicInvitationPage from '@/pages/PublicInvitationPage'

const router = createBrowserRouter([
  { path: '/', element: <DemoPage /> },
  { path: '/demo', element: <DemoPage /> },
  { path: '/:slug', element: <PublicInvitationPage /> },
  { path: '*', element: <NotFoundPage /> },
])

export default function App() {
  return <RouterProvider router={router} />
}

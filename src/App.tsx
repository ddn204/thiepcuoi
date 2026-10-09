import { createBrowserRouter, RouterProvider } from 'react-router'
import DashboardPage from '@/features/admin/DashboardPage'
import LoginPage from '@/features/admin/LoginPage'
import { RequireAuth } from '@/features/admin/RequireAuth'
import DemoPage from '@/pages/DemoPage'
import NotFoundPage from '@/pages/NotFoundPage'
import PublicInvitationPage from '@/pages/PublicInvitationPage'

const router = createBrowserRouter([
  { path: '/', element: <DemoPage /> },
  { path: '/demo', element: <DemoPage /> },
  { path: '/admin/login', element: <LoginPage /> },
  {
    path: '/admin',
    element: <RequireAuth />,
    children: [{ index: true, element: <DashboardPage /> }],
  },
  { path: '/:slug', element: <PublicInvitationPage /> },
  { path: '*', element: <NotFoundPage /> },
])

export default function App() {
  return <RouterProvider router={router} />
}

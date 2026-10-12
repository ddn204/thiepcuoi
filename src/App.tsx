import { createBrowserRouter, RouterProvider } from 'react-router'
import DashboardPage from '@/features/admin/DashboardPage'
import EditorPage from '@/features/admin/EditorPage'
import LoginPage from '@/features/admin/LoginPage'
import PlaygroundPage from '@/features/admin/PlaygroundPage'
import { RequireAuth } from '@/features/admin/RequireAuth'
import DemoPage from '@/pages/DemoPage'
import NotFoundPage from '@/pages/NotFoundPage'
import PublicInvitationPage from '@/pages/PublicInvitationPage'

const router = createBrowserRouter([
  { path: '/', element: <DemoPage /> },
  { path: '/demo', element: <DemoPage /> },
  { path: '/admin/login', element: <LoginPage /> },
  // Chỉ có khi chạy dev: thử editor không cần đăng nhập / DB
  ...(import.meta.env.DEV ? [{ path: '/admin/playground', element: <PlaygroundPage /> }] : []),
  {
    path: '/admin',
    element: <RequireAuth />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'thiep/:id', element: <EditorPage /> },
    ],
  },
  { path: '/:slug', element: <PublicInvitationPage /> },
  { path: '*', element: <NotFoundPage /> },
])

export default function App() {
  return <RouterProvider router={router} />
}

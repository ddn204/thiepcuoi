import { Loader2 } from 'lucide-react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import DemoPage from '@/pages/DemoPage'
import NotFoundPage from '@/pages/NotFoundPage'
import PublicInvitationPage from '@/pages/PublicInvitationPage'

/** Route admin tải riêng (lazy) để khách mở thiệp không phải tải code editor */
const lazyPage = (load: () => Promise<{ default: React.ComponentType }>) => async () => ({
  Component: (await load()).default,
})

const router = createBrowserRouter([
  {
    hydrateFallbackElement: <PageLoader />,
    children: [
      { path: '/', element: <DemoPage /> },
      { path: '/demo', element: <DemoPage /> },
      { path: '/admin/login', lazy: lazyPage(() => import('@/features/admin/LoginPage')) },
      // Chỉ có khi chạy dev: thử editor không cần đăng nhập / DB
      ...(import.meta.env.DEV
        ? [{ path: '/admin/playground', lazy: lazyPage(() => import('@/features/admin/PlaygroundPage')) }]
        : []),
      {
        path: '/admin',
        lazy: async () => ({ Component: (await import('@/features/admin/RequireAuth')).RequireAuth }),
        children: [
          { index: true, lazy: lazyPage(() => import('@/features/admin/DashboardPage')) },
          { path: 'thiep/:id', lazy: lazyPage(() => import('@/features/admin/EditorPage')) },
        ],
      },
      { path: '/:slug', element: <PublicInvitationPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

function PageLoader() {
  return (
    <div className="flex h-dvh items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  )
}

export default function App() {
  return <RouterProvider router={router} />
}

import { createBrowserRouter, RouterProvider } from 'react-router'
import DemoPage from '@/pages/DemoPage'

const router = createBrowserRouter([
  { path: '/', element: <DemoPage /> },
  { path: '/demo', element: <DemoPage /> },
])

export default function App() {
  return <RouterProvider router={router} />
}

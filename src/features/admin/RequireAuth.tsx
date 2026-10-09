import { Loader2 } from 'lucide-react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { Button } from '@/components/ui/button'
import { isSupabaseConfigured } from '@/lib/supabase'
import { signOut, useIsAdmin, useSession } from './api'

function CenteredMessage({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">{children}</div>
}

/** Chặn trang admin: phải đăng nhập và có trong bảng admin_users. */
export function RequireAuth() {
  const session = useSession()
  const location = useLocation()
  const isAdmin = useIsAdmin(session?.user.id)

  if (!isSupabaseConfigured) {
    return (
      <CenteredMessage>
        <h1 className="text-xl font-semibold">Chưa cấu hình Supabase</h1>
        <p className="max-w-md text-muted-foreground">
          Tạo file <code>.env</code> từ <code>.env.example</code>, điền VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY rồi
          chạy lại dev server.
        </p>
      </CenteredMessage>
    )
  }

  if (session === undefined || (session && isAdmin.isPending)) {
    return (
      <CenteredMessage>
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </CenteredMessage>
    )
  }

  if (!session) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />

  if (!isAdmin.data) {
    return (
      <CenteredMessage>
        <h1 className="text-xl font-semibold">Tài khoản chưa có quyền quản trị</h1>
        <p className="max-w-md text-muted-foreground">
          {session.user.email} đã đăng nhập nhưng chưa được thêm vào bảng <code>admin_users</code>.
        </p>
        <Button variant="outline" onClick={signOut}>
          Đăng xuất
        </Button>
      </CenteredMessage>
    )
  }

  return <Outlet />
}

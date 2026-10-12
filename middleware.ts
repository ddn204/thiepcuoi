import { next } from '@vercel/functions'
import { renderInvitationHtml } from './src/lib/og-meta.ts'

/**
 * Vercel Routing Middleware: trang thiệp là SPA nên bot của Zalo/Messenger/Facebook không thấy meta do React đặt.
 * Với `/{slug}` của thiệp đã xuất bản, trả về index.html đã chèn sẵn og:title/og:image; còn lại cho đi tiếp.
 * Chỉ dùng URL + publishable/anon key (RLS chỉ cho đọc thiệp đã xuất bản).
 */
export const config = {
  // Bỏ qua file tĩnh (có dấu chấm) và thư mục assets
  matcher: ['/((?!assets/|.*\\.).*)'],
}

const env = (...names: string[]) => names.map((name) => process.env[name]).find((value) => value?.trim()) ?? ''

export default async function middleware(request: Request) {
  try {
    const html = await renderInvitationHtml(request, {
      supabaseUrl: env('VITE_SUPABASE_URL', 'SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL'),
      supabaseKey: env(
        'VITE_SUPABASE_ANON_KEY',
        'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
        'SUPABASE_ANON_KEY',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      ),
    })
    if (html) {
      return new Response(html, {
        headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=0, must-revalidate' },
      })
    }
  } catch (error) {
    console.error('[og-meta]', error)
  }
  return next()
}

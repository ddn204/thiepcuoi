import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const firstDefined = (...values: (string | undefined)[]) => values.find((value) => value && value.trim()) ?? ''

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Đọc cả biến không có tiền tố VITE_ (vd biến do Supabase integration của Vercel tạo),
  // nhưng CHỈ đưa URL + publishable/anon key vào bundle. Key secret / service role không bao giờ lộ ra client.
  const env = loadEnv(mode, process.cwd(), '')
  const supabaseUrl = firstDefined(env.VITE_SUPABASE_URL, env.SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_URL)
  const supabaseKey = firstDefined(
    env.VITE_SUPABASE_ANON_KEY,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    env.SUPABASE_ANON_KEY,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseKey),
    },
  }
})

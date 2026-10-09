import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && key)

let client: SupabaseClient<Database> | null = null

/** Supabase client dùng chung. Gọi khi chưa cấu hình .env sẽ báo lỗi rõ ràng. */
export function getSupabase(): SupabaseClient<Database> {
  if (!url || !key) {
    throw new Error('Chưa cấu hình Supabase: thêm VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY vào file .env')
  }
  client ??= createClient<Database>(url, key)
  return client
}

export const MEDIA_BUCKET = 'invitation-media'

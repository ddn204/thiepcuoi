/**
 * Kiểu dữ liệu các bảng Supabase (viết tay, khớp supabase/migrations).
 * Dùng `type` thay vì `interface` vì supabase-js yêu cầu Row có index signature ngầm.
 */

export type InvitationRow = {
  id: string
  slug: string
  title: string
  data: unknown
  published: boolean
  owner_id: string | null
  created_at: string
  updated_at: string
}

export type GuestRow = {
  id: string
  invitation_id: string
  display_name: string
  code: string
  created_at: string
}

export type WishRow = {
  id: string
  invitation_id: string
  name: string
  message: string
  hidden: boolean
  created_at: string
}

export type RsvpRow = {
  id: string
  invitation_id: string
  guest_id: string | null
  name: string
  attending: boolean
  guest_count: number
  created_at: string
}

type Insert<Row, Optional extends keyof Row> = Omit<Row, Optional> & Partial<Pick<Row, Optional>>

type Table<Row, Optional extends keyof Row> = {
  Row: Row
  Insert: Insert<Row, Optional>
  Update: Partial<Row>
  Relationships: []
}

export type Database = {
  __InternalSupabase: { PostgrestVersion: '13' }
  public: {
    Tables: {
      invitations: Table<InvitationRow, 'id' | 'title' | 'data' | 'published' | 'owner_id' | 'created_at' | 'updated_at'>
      guests: Table<GuestRow, 'id' | 'code' | 'created_at'>
      wishes: Table<WishRow, 'id' | 'hidden' | 'created_at'>
      rsvps: Table<RsvpRow, 'id' | 'guest_id' | 'guest_count' | 'created_at'>
      admin_users: Table<{ user_id: string; created_at: string }, 'created_at'>
    }
    Views: { [_ in never]: never }
    Functions: {
      get_guest: {
        Args: { p_slug: string; p_code: string }
        Returns: { id: string; display_name: string }[]
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

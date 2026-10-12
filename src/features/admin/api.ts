import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Session } from '@supabase/supabase-js'
import { defaultInvitation } from '@/data/default-invitation'
import { getSupabase, isSupabaseConfigured, MEDIA_BUCKET } from '@/lib/supabase'
import type { GuestRow, RsvpRow, WishRow } from '@/types/database'
import type { InvitationData } from '@/types/invitation'
import { toInvitation } from '../invitation/api'

// ───────────────────────── Đăng nhập ─────────────────────────

/** `undefined` = đang kiểm tra, `null` = chưa đăng nhập */
export function useSession() {
  const [session, setSession] = useState<Session | null | undefined>(isSupabaseConfigured ? undefined : null)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    const supabase = getSupabase()
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])

  return session
}

export function useIsAdmin(userId: string | undefined) {
  return useQuery({
    queryKey: ['is-admin', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await getSupabase().rpc('is_admin')
      if (error) throw error
      return Boolean(data)
    },
  })
}

export async function signIn(email: string, password: string) {
  const { error } = await getSupabase().auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOut() {
  await getSupabase().auth.signOut()
}

// ───────────────────────── Thiệp ─────────────────────────

export function useInvitations() {
  return useQuery({
    queryKey: ['admin', 'invitations'],
    queryFn: async () => {
      const { data, error } = await getSupabase()
        .from('invitations')
        .select('*')
        .order('updated_at', { ascending: false })
      if (error) throw error
      return data.map(toInvitation)
    },
  })
}

export function useInvitation(id: string) {
  return useQuery({
    queryKey: ['admin', 'invitation', id],
    queryFn: async () => {
      const { data, error } = await getSupabase().from('invitations').select('*').eq('id', id).maybeSingle()
      if (error) throw error
      return data ? toInvitation(data) : null
    },
  })
}

/** Lỗi trùng slug từ Postgres (unique violation) */
export const isDuplicateSlugError = (error: unknown) =>
  typeof error === 'object' && error !== null && 'code' in error && error.code === '23505'

export function useCreateInvitation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { title: string; slug: string }) => {
      const { data, error } = await getSupabase()
        .from('invitations')
        .insert({ title: input.title, slug: input.slug, data: defaultInvitation })
        .select('id')
        .single()
      if (error) throw error
      return data.id
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'invitations'] }),
  })
}

export interface InvitationPatch {
  title?: string
  slug?: string
  published?: boolean
  data?: InvitationData
}

export function useUpdateInvitation(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (patch: InvitationPatch) => {
      const { data, error } = await getSupabase().from('invitations').update(patch).eq('id', id).select('*').single()
      if (error) throw error
      return toInvitation(data)
    },
    onSuccess: (invitation) => {
      queryClient.setQueryData(['admin', 'invitation', id], invitation)
      queryClient.invalidateQueries({ queryKey: ['admin', 'invitations'] })
      queryClient.invalidateQueries({ queryKey: ['invitation', 'slug'] })
    },
  })
}

export function useDeleteInvitation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = getSupabase()
      const { error } = await supabase.from('invitations').delete().eq('id', id)
      if (error) throw error
      // Dọn ảnh/nhạc trong thư mục `{id}/` của thiệp; lỗi ở bước này không làm hỏng việc xoá thiệp
      const media = supabase.storage.from(MEDIA_BUCKET)
      const { data: files } = await media.list(id, { limit: 1000 })
      if (files?.length) {
        const { error: removeError } = await media.remove(files.map((file) => `${id}/${file.name}`))
        if (removeError) console.warn('Không xoá được media của thiệp', removeError)
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'invitations'] }),
  })
}

// ───────────────────────── Lời chúc ─────────────────────────

export function useAdminWishes(invitationId: string) {
  return useQuery({
    queryKey: ['admin', 'wishes', invitationId],
    queryFn: async (): Promise<WishRow[]> => {
      const { data, error } = await getSupabase()
        .from('wishes')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useUpdateWish(invitationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, hidden }: { id: string; hidden: boolean }) => {
      const { error } = await getSupabase().from('wishes').update({ hidden }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'wishes', invitationId] }),
  })
}

export function useDeleteWish(invitationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await getSupabase().from('wishes').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'wishes', invitationId] }),
  })
}

// ───────────────────────── Xác nhận tham dự ─────────────────────────

export function useRsvps(invitationId: string) {
  return useQuery({
    queryKey: ['admin', 'rsvps', invitationId],
    queryFn: async (): Promise<RsvpRow[]> => {
      const { data, error } = await getSupabase()
        .from('rsvps')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useDeleteRsvp(invitationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await getSupabase().from('rsvps').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'rsvps', invitationId] }),
  })
}

// ───────────────────────── Khách mời ─────────────────────────

export function useGuests(invitationId: string) {
  return useQuery({
    queryKey: ['admin', 'guests', invitationId],
    queryFn: async (): Promise<GuestRow[]> => {
      const { data, error } = await getSupabase()
        .from('guests')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data
    },
  })
}

export function useAddGuests(invitationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (names: string[]) => {
      const rows = names.map((display_name) => ({ invitation_id: invitationId, display_name }))
      const { error } = await getSupabase().from('guests').insert(rows)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'guests', invitationId] }),
  })
}

export function useDeleteGuest(invitationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await getSupabase().from('guests').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'guests', invitationId] }),
  })
}

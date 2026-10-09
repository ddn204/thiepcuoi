import { useMutation, useQuery } from '@tanstack/react-query'
import { normalizeInvitationData } from '@/data/default-invitation'
import { getSupabase } from '@/lib/supabase'
import type { Invitation } from '@/types/invitation'
import type { InvitationRow } from '@/types/database'

export function toInvitation(row: InvitationRow): Invitation {
  return { ...row, data: normalizeInvitationData(row.data) }
}

/** Thiệp đã publish theo slug (RLS tự chặn thiệp chưa publish). `null` = không tìm thấy. */
export function usePublishedInvitation(slug: string) {
  return useQuery({
    queryKey: ['invitation', 'slug', slug],
    queryFn: async () => {
      const { data, error } = await getSupabase().from('invitations').select('*').eq('slug', slug).maybeSingle()
      if (error) throw error
      return data ? toInvitation(data) : null
    },
  })
}

/** Khách mời theo mã trong link (?g=code). */
export function useGuest(slug: string, code: string | null) {
  return useQuery({
    queryKey: ['guest', slug, code],
    enabled: Boolean(code),
    queryFn: async () => {
      const { data, error } = await getSupabase().rpc('get_guest', { p_slug: slug, p_code: code! })
      if (error) throw error
      return data?.[0] ?? null
    },
  })
}

export function useSubmitRsvp(invitationId: string | undefined, guestId: string | undefined) {
  return useMutation({
    mutationFn: async (input: { name: string; attending: boolean; guestCount: number }) => {
      const { error } = await getSupabase()
        .from('rsvps')
        .insert({
          invitation_id: invitationId!,
          guest_id: guestId ?? null,
          name: input.name.trim(),
          attending: input.attending,
          guest_count: input.attending ? input.guestCount : 0,
        })
      if (error) throw error
    },
  })
}

import imageCompression from 'browser-image-compression'
import { getSupabase, MEDIA_BUCKET } from './supabase'

export type MediaKind = 'image' | 'audio'

const MAX_AUDIO_MB = 15

/**
 * Upload ảnh/nhạc lên Supabase Storage, trả về URL public.
 * Ảnh được nén sang WebP (cạnh dài tối đa 1600px); GIF giữ nguyên để không mất chuyển động.
 */
export async function uploadMedia(file: File, invitationId: string, kind: MediaKind): Promise<string> {
  let body: Blob = file
  let contentType = file.type
  let ext = file.name.split('.').pop()?.toLowerCase() || 'bin'

  if (kind === 'image') {
    if (!file.type.startsWith('image/')) throw new Error('File không phải ảnh')
    if (file.type !== 'image/gif') {
      body = await imageCompression(file, {
        maxWidthOrHeight: 1600,
        maxSizeMB: 1.2,
        fileType: 'image/webp',
        initialQuality: 0.85,
        useWebWorker: true,
      })
      contentType = 'image/webp'
      ext = 'webp'
    }
  } else {
    if (!file.type.startsWith('audio/')) throw new Error('File không phải nhạc')
    if (file.size > MAX_AUDIO_MB * 1024 * 1024) throw new Error(`File nhạc tối đa ${MAX_AUDIO_MB}MB`)
  }

  const supabase = getSupabase()
  const path = `${invitationId}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, body, { contentType, cacheControl: '31536000', upsert: false })
  if (error) throw error
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl
}

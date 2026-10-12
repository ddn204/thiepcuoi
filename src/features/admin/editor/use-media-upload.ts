import { useState } from 'react'
import { toast } from 'sonner'
import { uploadMedia, type MediaKind } from '@/lib/upload-media'
import { useEditorContext } from './editor-context'

/** Tải file lên thư mục của thiệp đang sửa; báo lỗi bằng toast và trả về null khi thất bại. */
export function useMediaUpload(kind: MediaKind) {
  const { invitationId } = useEditorContext()
  const [uploading, setUploading] = useState(false)

  const upload = async (file: File): Promise<string | null> => {
    setUploading(true)
    try {
      return await uploadMedia(file, invitationId, kind)
    } catch (error) {
      toast.error('Tải lên thất bại', { description: error instanceof Error ? error.message : undefined })
      return null
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading }
}

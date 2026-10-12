import { defaultInvitation } from '@/data/default-invitation'
import type { Invitation } from '@/types/invitation'
import { Editor } from './EditorPage'

const sample: Invitation = {
  id: 'playground',
  slug: 'thiep-mau',
  title: 'Thiệp thử nghiệm',
  data: defaultInvitation,
  published: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

/** Chỉ dùng khi dev: thử giao diện chỉnh sửa với dữ liệu mẫu, không cần Supabase (nút Lưu sẽ báo lỗi). */
export default function PlaygroundPage() {
  return <Editor invitation={sample} />
}

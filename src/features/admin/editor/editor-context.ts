import { createContext, useContext } from 'react'

/** Thông tin thiệp đang sửa, dùng cho upload (đường dẫn file theo id thiệp). */
export const EditorContext = createContext<{ invitationId: string }>({ invitationId: '' })

export const useEditorContext = () => useContext(EditorContext)

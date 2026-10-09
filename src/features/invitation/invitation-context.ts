import { createContext, useContext } from 'react'

export interface InvitationRuntime {
  /** id thiệp trong DB; `undefined` = thiệp mẫu / preview, không ghi DB */
  invitationId?: string
  guestId?: string
  guestName?: string
  mode: 'live' | 'preview'
}

export const InvitationRuntimeContext = createContext<InvitationRuntime>({ mode: 'live' })

export const useInvitationRuntime = () => useContext(InvitationRuntimeContext)

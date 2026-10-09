import { createContext, useContext } from 'react'

/**
 * Phần tử cuộn chứa thiệp. `null` = cuộn theo window (trang public).
 * Trong khung preview của admin, thiệp nằm trong một div tự cuộn nên các hiệu ứng
 * phụ thuộc vị trí cuộn (reveal, auto-scroll) cần biết phần tử này.
 */
export const ScrollContainerContext = createContext<HTMLElement | null>(null)

export const useScrollContainer = () => useContext(ScrollContainerContext)

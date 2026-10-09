import { useEffect } from 'react'

const SPEED_PX_PER_SECOND = 40
const START_DELAY_MS = 1500
const USER_EVENTS = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const

/**
 * Tự cuộn chậm xuống cuối thiệp. Dừng hẳn khi người xem tự cuộn / chạm / bấm phím,
 * hoặc khi đã tới cuối trang. `scroller = null` nghĩa là cuộn window.
 */
export function useAutoScroll(enabled: boolean, scroller: HTMLElement | null) {
  useEffect(() => {
    if (!enabled) return

    const getTop = () => (scroller ? scroller.scrollTop : window.scrollY)
    const getMax = () =>
      scroller
        ? scroller.scrollHeight - scroller.clientHeight
        : document.documentElement.scrollHeight - window.innerHeight
    const setTop = (top: number) => (scroller ? (scroller.scrollTop = top) : window.scrollTo(0, top))

    let frame = 0
    let position = getTop()
    let lastTime = 0
    let stopped = false

    const stop = () => {
      stopped = true
      cancelAnimationFrame(frame)
      USER_EVENTS.forEach((type) => window.removeEventListener(type, stop))
    }

    const step = (time: number) => {
      if (stopped) return
      if (lastTime) {
        // Người xem đã tự cuộn (vd kéo thanh cuộn) → dừng
        if (Math.abs(getTop() - Math.round(position)) > 3) return stop()
        position = Math.min(position + (SPEED_PX_PER_SECOND * (time - lastTime)) / 1000, getMax())
        setTop(Math.round(position))
        if (position >= getMax()) return stop()
      }
      lastTime = time
      frame = requestAnimationFrame(step)
    }

    const timer = window.setTimeout(() => {
      position = getTop()
      USER_EVENTS.forEach((type) => window.addEventListener(type, stop, { passive: true }))
      frame = requestAnimationFrame(step)
    }, START_DELAY_MS)

    return () => {
      window.clearTimeout(timer)
      stop()
    }
  }, [enabled, scroller])
}

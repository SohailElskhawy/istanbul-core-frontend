import { useEffect } from 'react'
import { useFocusStore } from '../focusStore'

/**
 * Drives the focus timer by calling tick() every second while the session is running.
 * Uses useEffect for proper cleanup — no memory leaks on HMR or unmount.
 * 
 * Mount this hook once in a top-level component (e.g. AppLayout or FocusPage).
 */
export function useFocusTimer() {
  const status = useFocusStore((state) => state.status)
  const tick = useFocusStore((state) => state.tick)

  useEffect(() => {
    if (status !== 'running') return

    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [status, tick])
}

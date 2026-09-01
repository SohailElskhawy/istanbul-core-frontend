import { NavLink } from 'react-router-dom'
import { Timer } from 'lucide-react'
import { useFocusStore } from '../focusStore'
import { cn } from '../../../shared/lib/utils'

interface FocusTimerIndicatorProps {
  /** When true, only shows the icon (for collapsed sidebar) */
  compact?: boolean
  className?: string
}

/**
 * A small animated pill that links to /focus and displays the remaining time.
 * Only renders when a focus session is actively running.
 */
export function FocusTimerIndicator({ compact = false, className }: FocusTimerIndicatorProps) {
  const status = useFocusStore((state) => state.status)
  const remainingSeconds = useFocusStore((state) => state.remainingSeconds)

  if (status !== 'running') return null

  const mins = Math.floor(remainingSeconds / 60)
  const secs = remainingSeconds % 60
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

  return (
    <NavLink
      to="/focus"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] font-mono text-xs font-semibold animate-pulse',
        compact ? 'justify-center p-2' : 'px-2.5 py-1.5',
        className
      )}
    >
      <Timer className="h-4 w-4 shrink-0" />
      {!compact && <span>{formatted}</span>}
    </NavLink>
  )
}

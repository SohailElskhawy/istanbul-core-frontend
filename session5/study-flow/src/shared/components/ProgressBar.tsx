import { cn } from '../lib/utils'

interface ProgressBarProps {
  /** Progress percentage (0-100) */
  percent: number
  /** Color of the filled portion. Defaults to var(--primary) */
  color?: string
  className?: string
}

/**
 * A horizontal progress bar with a customizable fill color.
 * Used for course progress and focus timer progress.
 */
export function ProgressBar({ percent, color, className }: ProgressBarProps) {
  return (
    <div
      className={cn(
        'h-1.5 w-full bg-[var(--surface-subtle)] rounded-full overflow-hidden border border-[var(--border)]',
        className
      )}
    >
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${percent}%`,
          backgroundColor: color || 'var(--primary)',
        }}
      />
    </div>
  )
}

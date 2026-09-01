import { cn } from '../lib/utils'

interface CourseBadgeProps {
  code: string
  color: string
  className?: string
}

/**
 * A small pill/badge showing a course code with the course's theme color.
 * Used in TaskCard, CourseCard, DashboardPage, and FocusPage.
 */
export function CourseBadge({ code, color, className }: CourseBadgeProps) {
  return (
    <span
      className={cn(
        'text-[11px] font-semibold px-2 py-0.5 rounded-md border font-mono',
        className
      )}
      style={{
        backgroundColor: `${color}15`,
        color,
        borderColor: `${color}30`,
      }}
    >
      {code}
    </span>
  )
}

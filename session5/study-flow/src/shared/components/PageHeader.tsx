import React from 'react'
import { cn } from '../lib/utils'

export interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-(--border)',
        className
      )}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-(--foreground)">{title}</h1>
        {subtitle && (
          <p className="text-sm text-(--muted-foreground) mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
    </div>
  )
}

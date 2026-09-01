import React from 'react'
import { cn } from '../lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline'
  size?: 'sm' | 'md'
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-[var(--surface-subtle)] text-[var(--muted-foreground)] border-[var(--border)]',
    primary: 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20',
    success: 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20',
    warning: 'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20',
    danger: 'bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20',
    outline: 'border-[var(--border)] text-[var(--foreground)] bg-transparent',
  }

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border transition-colors select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

import React from 'react'
import { cn } from '../lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'interactive'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-[var(--surface)] border-[var(--border)] shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
      subtle: 'bg-[var(--surface-subtle)] border-[var(--border)]',
      interactive:
        'bg-[var(--surface)] border-[var(--border)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-[var(--muted-foreground)]/40 hover:shadow-sm cursor-pointer transition-all duration-150',
    }

    return (
      <div
        ref={ref}
        className={cn('rounded-xl border p-5 text-start', variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('font-semibold text-base text-[var(--foreground)] tracking-tight', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs text-[var(--muted-foreground)]', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center pt-4 border-t border-[var(--border)]', className)} {...props}>
      {children}
    </div>
  )
}

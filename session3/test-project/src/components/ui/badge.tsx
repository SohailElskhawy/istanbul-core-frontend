import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-indigo-600 text-white shadow hover:bg-indigo-700',
        secondary:
          'border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
        destructive:
          'border-transparent bg-red-500 text-white shadow hover:bg-red-600',
        outline: 'text-neutral-950 border-neutral-300',
        scheduled:
          'border-amber-200 bg-amber-50 text-amber-800 font-medium',
        active:
          'border-blue-200 bg-blue-50 text-blue-800 font-medium',
        completed:
          'border-emerald-200 bg-emerald-50 text-emerald-800 font-medium',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

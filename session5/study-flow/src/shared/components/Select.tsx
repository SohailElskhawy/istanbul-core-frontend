import React, { useId } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../lib/utils'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options?: SelectOption[]
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, children, id, ...props }, ref) => {
    const reactId = useId()
    const selectId = id || reactId

    return (
      <div className="w-full space-y-1.5 text-left rtl:text-right">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-(--foreground)">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full appearance-none rounded-xl border border-(--border) bg-(--surface) px-3.5 py-2 pr-10 rtl:pr-3.5 rtl:pl-10 text-sm text-(--foreground) transition-all focus:border-(--primary) focus:outline-none focus:ring-2 focus:ring-(--primary)/20 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer text-left rtl:text-right',
              error && 'border-(--danger) focus:border-(--danger) focus:ring-(--danger)/20',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute right-3 rtl:right-auto rtl:left-3 pointer-events-none text-(--muted-foreground)">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && <p className="text-xs text-(--danger) font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-(--muted-foreground)">{hint}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

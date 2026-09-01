import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from './Button'

export interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}: DialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full bg-(--surface) border border-(--border) rounded-2xl shadow-xl p-6 z-10 transition-all text-left rtl:text-right animate-in fade-in zoom-in-95 duration-150',
          maxWidths[maxWidth]
        )}
        aria-labelledby="dialog-title"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            {title && (
              <h2 id="dialog-title" className="text-lg font-semibold text-(--foreground) tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-(--muted-foreground) mt-1">{description}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg h-8 w-8 text-(--muted-foreground) hover:text-(--foreground) shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  )
}

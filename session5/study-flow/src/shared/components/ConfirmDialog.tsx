import { useTranslation } from 'react-i18next'
import { AlertTriangle } from 'lucide-react'
import { Dialog } from './Dialog'
import { Button } from './Button'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmLabel?: string
  isLoading?: boolean
}

/**
 * A confirmation dialog that replaces browser's native window.confirm().
 * Matches the app's design language and supports i18n.
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  isLoading = false,
}: ConfirmDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title} description={description} maxWidth="sm">
      <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--danger)]/5 border border-[var(--danger)]/20 mb-4">
        <AlertTriangle className="h-5 w-5 text-[var(--danger)] shrink-0" />
        <p className="text-sm text-[var(--foreground)]">{description}</p>
      </div>
      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          {t('common.cancel')}
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
          {confirmLabel || t('common.delete')}
        </Button>
      </div>
    </Dialog>
  )
}

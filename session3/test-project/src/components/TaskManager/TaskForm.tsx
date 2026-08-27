import { useId, useRef, useState, type FormEvent } from 'react'
import {
  getTodayDateString,
  validateDraft,
  type TaskDraft,
  type FieldErrors,
} from '@/lib/tasks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Check } from 'lucide-react'

type TaskFormProps = {
  onSubmit: (draft: TaskDraft) => void | Promise<void>
  initialValues?: Partial<TaskDraft>
  submitLabel?: string
  onCancel?: () => void
  formId?: string
}

export default function TaskForm({
  onSubmit,
  initialValues,
  submitLabel = 'Add task',
  onCancel,
  formId,
}: TaskFormProps) {
  const titleRef = useRef<HTMLInputElement>(null)
  const generatedId = useId()
  const today = getTodayDateString()

  const [draft, setDraft] = useState<TaskDraft>(() => ({
    title: initialValues?.title ?? '',
    startDate: initialValues?.startDate ?? today,
    endDate: initialValues?.endDate ?? today,
  }))

  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fieldId = (field: keyof TaskDraft) => `${formId ?? generatedId}-${field}`
  const errorId = (field: keyof TaskDraft) => `${fieldId(field)}-error`

  function updateField(field: keyof TaskDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field] && field !== 'startDate' && field !== 'endDate') {
        return current
      }
      const next = { ...current }
      delete next[field]
      if (field === 'startDate' || field === 'endDate') {
        delete next.endDate
      }
      return next
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextDraft: TaskDraft = {
      title: draft.title.trim(),
      startDate: draft.startDate,
      endDate: draft.endDate,
    }

    const nextErrors = validateDraft(nextDraft)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.title) {
        titleRef.current?.focus()
      }
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(nextDraft)
      if (!initialValues) {
        setDraft({
          title: '',
          startDate: today,
          endDate: today,
        })
        setErrors({})
        titleRef.current?.focus()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      id={formId}
      className="space-y-4"
      onSubmit={handleSubmit}
      noValidate
      aria-label={initialValues ? 'Edit task form' : 'Create task form'}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
        <div className="md:col-span-6 space-y-1">
          <label
            htmlFor={fieldId('title')}
            className="block text-xs font-semibold uppercase tracking-wider text-neutral-600"
          >
            Task title <span className="text-red-500">*</span>
          </label>
          <Input
            ref={titleRef}
            id={fieldId('title')}
            value={draft.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="What needs your attention?"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? errorId('title') : undefined}
            autoComplete="off"
            className={errors.title ? 'border-red-500 focus-visible:ring-red-400' : ''}
          />
          {errors.title && (
            <p id={errorId('title')} className="text-xs text-red-600 font-medium" role="alert">
              {errors.title}
            </p>
          )}
        </div>

        <div className="md:col-span-3 space-y-1">
          <label
            htmlFor={fieldId('startDate')}
            className="block text-xs font-semibold uppercase tracking-wider text-neutral-600"
          >
            Start date <span className="text-red-500">*</span>
          </label>
          <Input
            id={fieldId('startDate')}
            type="date"
            value={draft.startDate}
            onChange={(e) => updateField('startDate', e.target.value)}
            aria-invalid={Boolean(errors.startDate)}
            aria-describedby={errors.startDate ? errorId('startDate') : undefined}
            className={errors.startDate ? 'border-red-500 focus-visible:ring-red-400' : ''}
          />
          {errors.startDate && (
            <p id={errorId('startDate')} className="text-xs text-red-600 font-medium" role="alert">
              {errors.startDate}
            </p>
          )}
        </div>

        <div className="md:col-span-3 space-y-1">
          <label
            htmlFor={fieldId('endDate')}
            className="block text-xs font-semibold uppercase tracking-wider text-neutral-600"
          >
            End date <span className="text-red-500">*</span>
          </label>
          <Input
            id={fieldId('endDate')}
            type="date"
            value={draft.endDate}
            min={draft.startDate || undefined}
            onChange={(e) => updateField('endDate', e.target.value)}
            aria-invalid={Boolean(errors.endDate)}
            aria-describedby={errors.endDate ? errorId('endDate') : undefined}
            className={errors.endDate ? 'border-red-500 focus-visible:ring-red-400' : ''}
          />
          {errors.endDate && (
            <p id={errorId('endDate')} className="text-xs text-red-600 font-medium" role="alert">
              {errors.endDate}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
        >
          {initialValues ? (
            <Check className="w-4 h-4 mr-1" />
          ) : (
            <Plus className="w-4 h-4 mr-1" />
          )}
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}

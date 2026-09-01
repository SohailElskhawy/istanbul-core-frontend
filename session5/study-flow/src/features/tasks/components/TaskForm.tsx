import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { taskFormSchema, type TaskFormData } from '../schemas/taskSchema'
import type { Task, Course } from '../../../shared/types'
import { Input } from '../../../shared/components/Input'
import { Select } from '../../../shared/components/Select'
import { Button } from '../../../shared/components/Button'
import { useLocalizedText } from '../../../shared/hooks/useLocalizedText'

/** Extracts react-hook-form defaults from an existing task or provides empty defaults. */
function getTaskFormDefaults(task: Task | null | undefined, courses: Course[]): TaskFormData {
  if (task) {
    return {
      titleEn: task.title.en,
      titleAr: task.title.ar || '',
      descriptionEn: task.description?.en || '',
      descriptionAr: task.description?.ar || '',
      courseId: task.courseId,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      estimatedMinutes: task.estimatedMinutes,
    }
  }
  return {
    titleEn: '',
    titleAr: '',
    descriptionEn: '',
    descriptionAr: '',
    courseId: courses[0]?.id || '',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date().toISOString().split('T')[0],
    estimatedMinutes: 45,
  }
}

interface TaskFormProps {
  initialTask?: Task | null
  courses: Course[]
  onSubmit: (data: TaskFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function TaskForm({
  initialTask,
  courses,
  onSubmit,
  onCancel,
  isLoading = false,
}: TaskFormProps) {
  const { t } = useTranslation()
  const localize = useLocalizedText()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: getTaskFormDefaults(initialTask, courses),
  })

  useEffect(() => {
    reset(getTaskFormDefaults(initialTask, courses))
  }, [initialTask, courses, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left rtl:text-right">
      {/* Title Fields (English & Arabic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={`${t('tasks.taskTitleLabel')} (EN)`}
          placeholder="e.g. Implement binary search"
          error={errors.titleEn?.message}
          {...register('titleEn')}
        />
        <Input
          label={`${t('tasks.taskTitleLabel')} (العربية)`}
          placeholder="مثال: تنفيذ خوارزمية البحث الثنائي"
          error={errors.titleAr?.message}
          {...register('titleAr')}
        />
      </div>

      {/* Description Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[var(--foreground)]">
            {t('tasks.descriptionLabel')} (EN)
          </label>
          <textarea
            rows={2}
            placeholder="Details in English..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-all focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            {...register('descriptionEn')}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[var(--foreground)]">
            {t('tasks.descriptionLabel')} (العربية)
          </label>
          <textarea
            rows={2}
            placeholder="تفاصيل باللغة العربية..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-all focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            {...register('descriptionAr')}
          />
        </div>
      </div>

      {/* Course & Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label={t('tasks.courseLabel')}
          error={errors.courseId?.message}
          {...register('courseId')}
        >
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} - {localize(c.name)}
            </option>
          ))}
        </Select>

        <Select
          label={t('common.priority')}
          error={errors.priority?.message}
          {...register('priority')}
        >
          <option value="low">{t('priority.low')}</option>
          <option value="medium">{t('priority.medium')}</option>
          <option value="high">{t('priority.high')}</option>
        </Select>
      </div>

      {/* Status, Due Date & Estimated Minutes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label={t('common.status')}
          error={errors.status?.message}
          {...register('status')}
        >
          <option value="todo">{t('status.todo')}</option>
          <option value="in_progress">{t('status.in_progress')}</option>
          <option value="completed">{t('status.completed')}</option>
        </Select>

        <Input
          label={t('tasks.dueDateLabel')}
          type="date"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />

        <Input
          label={t('tasks.estimatedMinutesLabel')}
          type="number"
          min={1}
          max={1440}
          error={errors.estimatedMinutes?.message}
          {...register('estimatedMinutes', { valueAsNumber: true })}
        />
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          {t('common.cancel')}
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialTask ? t('common.save') : t('common.create')}
        </Button>
      </div>
    </form>
  )
}

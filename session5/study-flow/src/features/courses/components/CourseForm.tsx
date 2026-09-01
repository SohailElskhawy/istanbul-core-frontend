import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { courseFormSchema, type CourseFormData } from '../schemas/courseSchema'
import { Input } from '../../../shared/components/Input'
import { Button } from '../../../shared/components/Button'

const COLOR_OPTIONS = ['#2d5a43', '#3b82f6', '#b45309', '#7c3aed', '#dc2626', '#0284c7']

interface CourseFormProps {
  onSubmit: (data: CourseFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

/**
 * Course creation form using react-hook-form + Zod validation.
 * Consistent pattern with TaskForm.
 */
export function CourseForm({ onSubmit, onCancel, isLoading = false }: CourseFormProps) {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      nameEn: '',
      nameAr: '',
      code: '',
      instructorEn: '',
      instructorAr: '',
      credits: 3,
      color: '#2d5a43',
    },
  })

  const selectedColor = watch('color')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left rtl:text-right">
      {/* Course Name (EN & AR) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={`${t('courses.courseNameLabel')} (EN)`}
          placeholder="e.g. Data Structures"
          error={errors.nameEn?.message}
          {...register('nameEn')}
        />
        <Input
          label={`${t('courses.courseNameLabel')} (العربية)`}
          placeholder="مثال: هياكل البيانات"
          error={errors.nameAr?.message}
          {...register('nameAr')}
        />
      </div>

      {/* Code & Credits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('courses.courseCodeLabel')}
          placeholder="e.g. CS201"
          error={errors.code?.message}
          {...register('code')}
        />
        <Input
          label={t('courses.creditsLabel')}
          type="number"
          min={1}
          max={10}
          error={errors.credits?.message}
          {...register('credits', { valueAsNumber: true })}
        />
      </div>

      {/* Instructor (EN & AR) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={`${t('courses.instructorLabel')} (EN)`}
          placeholder="e.g. Dr. Alan Turing"
          error={errors.instructorEn?.message}
          {...register('instructorEn')}
        />
        <Input
          label={`${t('courses.instructorLabel')} (العربية)`}
          placeholder="مثال: د. آلان تورينج"
          error={errors.instructorAr?.message}
          {...register('instructorAr')}
        />
      </div>

      {/* Color Picker */}
      <div className="space-y-1.5 text-left rtl:text-right">
        <label className="block text-xs font-semibold text-[var(--foreground)]">
          {t('courses.colorLabel')}
        </label>
        <div className="flex items-center gap-2">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setValue('color', c)}
              className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                selectedColor === c
                  ? 'scale-110 border-[var(--foreground)]'
                  : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {t('common.create')}
        </Button>
      </div>
    </form>
  )
}

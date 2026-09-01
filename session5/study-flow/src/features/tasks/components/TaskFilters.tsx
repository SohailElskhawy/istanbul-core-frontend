import { useTranslation } from 'react-i18next'
import { Search, Filter } from 'lucide-react'
import type { Course, TaskPriority, TaskStatus } from '../../../shared/types'
import { Input } from '../../../shared/components/Input'
import { Select } from '../../../shared/components/Select'
import { useLocalizedText } from '../../../shared/hooks/useLocalizedText'

export interface TaskFilterState {
  search: string
  status: TaskStatus | 'all'
  priority: TaskPriority | 'all'
  courseId: string | 'all'
}

interface TaskFiltersProps {
  filters: TaskFilterState
  courses: Course[]
  onChange: (filters: TaskFilterState) => void
}

export function TaskFilters({
  filters,
  courses,
  onChange,
}: TaskFiltersProps) {
  const { t } = useTranslation()
  const localize = useLocalizedText()

  return (
    <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)] space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <Input
          placeholder={t('common.search')}
          leftIcon={<Search className="h-4 w-4" />}
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />

        {/* Status Filter */}
        <Select
          value={filters.status}
          onChange={(e) =>
            onChange({ ...filters, status: e.target.value as TaskStatus | 'all' })
          }
        >
          <option value="all">
            {t('common.status')}: {t('common.all')}
          </option>
          <option value="todo">{t('status.todo')}</option>
          <option value="in_progress">{t('status.in_progress')}</option>
          <option value="completed">{t('status.completed')}</option>
        </Select>

        {/* Priority Filter */}
        <Select
          value={filters.priority}
          onChange={(e) =>
            onChange({
              ...filters,
              priority: e.target.value as TaskPriority | 'all',
            })
          }
        >
          <option value="all">
            {t('common.priority')}: {t('common.all')}
          </option>
          <option value="high">{t('priority.high')}</option>
          <option value="medium">{t('priority.medium')}</option>
          <option value="low">{t('priority.low')}</option>
        </Select>

        {/* Course Filter */}
        <Select
          value={filters.courseId}
          onChange={(e) => onChange({ ...filters, courseId: e.target.value })}
        >
          <option value="all">
            {t('common.course')}: {t('common.all')}
          </option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code} - {localize(course.name)}
            </option>
          ))}
        </Select>
      </div>

      {(filters.search ||
        filters.status !== 'all' ||
        filters.priority !== 'all' ||
        filters.courseId !== 'all') && (
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-xs text-[var(--muted-foreground)]">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5" />
            <span>{t('common.filter')}</span>
          </div>
          <button
            type="button"
            onClick={() =>
              onChange({
                search: '',
                status: 'all',
                priority: 'all',
                courseId: 'all',
              })
            }
            className="text-[var(--primary)] hover:underline cursor-pointer font-medium"
          >
            {t('common.reset')}
          </button>
        </div>
      )}
    </div>
  )
}

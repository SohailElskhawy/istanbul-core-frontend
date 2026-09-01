import { useTranslation } from 'react-i18next'
import { Calendar, Clock, Edit2, Trash2, CheckCircle2, Circle, PlayCircle } from 'lucide-react'
import type { Task, Course, TaskStatus } from '../../../shared/types'
import { Card } from '../../../shared/components/Card'
import { Badge } from '../../../shared/components/Badge'
import { Button } from '../../../shared/components/Button'
import { CourseBadge } from '../../../shared/components/CourseBadge'
import { useLocalizedText } from '../../../shared/hooks/useLocalizedText'
import { PRIORITY_BADGE_VARIANT } from '../../../shared/lib/utils'

interface TaskCardProps {
  task: Task
  course?: Course
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, newStatus: TaskStatus) => void
}

export function TaskCard({
  task,
  course,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const { t } = useTranslation()
  const localize = useLocalizedText()

  const titleText = localize(task.title)
  const descriptionText = localize(task.description)

  const handleNextStatus = () => {
    if (task.status === 'todo') {
      onStatusChange(task.id, 'in_progress')
    } else if (task.status === 'in_progress') {
      onStatusChange(task.id, 'completed')
    } else {
      onStatusChange(task.id, 'todo')
    }
  }

  return (
    <Card className="p-4 transition-all hover:border-[var(--muted-foreground)]/30 group">
      <div className="flex items-start justify-between gap-4">
        {/* Check/Status trigger and Title */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={handleNextStatus}
            title={t('common.status')}
            aria-label={t('common.status')}
            className="mt-0.5 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors cursor-pointer shrink-0"
          >
            {task.status === 'completed' ? (
              <CheckCircle2 className="h-5 w-5 text-[var(--success)]" />
            ) : task.status === 'in_progress' ? (
              <PlayCircle className="h-5 w-5 text-[var(--primary)]" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className={`text-sm font-semibold truncate ${
                  task.status === 'completed'
                    ? 'line-through text-[var(--muted-foreground)]'
                    : 'text-[var(--foreground)]'
                }`}
              >
                {titleText}
              </span>
              {course && (
                <CourseBadge code={course.code} color={course.color} />
              )}
            </div>

            {descriptionText && (
              <p className="text-xs text-[var(--muted-foreground)] mb-2.5 line-clamp-2 leading-relaxed">
                {descriptionText}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--muted-foreground)]">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>{task.dueDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {task.estimatedMinutes} {t('common.minutesShort')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Priority & Actions */}
        <div className="flex flex-col items-end gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5">
            <Badge variant={PRIORITY_BADGE_VARIANT[task.priority] || 'default'}>
              {t(`priority.${task.priority}`)}
            </Badge>
            <Badge
              variant={
                task.status === 'completed'
                  ? 'success'
                  : task.status === 'in_progress'
                    ? 'primary'
                    : 'default'
              }
            >
              {t(`status.${task.status}`)}
            </Badge>
          </div>

          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(task)}
              aria-label={t('common.edit')}
              className="h-7 w-7 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task.id)}
              aria-label={t('common.delete')}
              className="h-7 w-7 text-[var(--muted-foreground)] hover:text-[var(--danger)]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

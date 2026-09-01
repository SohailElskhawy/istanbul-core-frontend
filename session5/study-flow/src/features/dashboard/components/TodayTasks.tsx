import { useTranslation } from 'react-i18next'
import type { Task } from '../../../shared/types'
import { useLocalizedText } from '../../../shared/hooks/useLocalizedText'
import { PRIORITY_BADGE_VARIANT } from '../../../shared/lib/utils'
import { Card } from '../../../shared/components/Card'
import { Badge } from '../../../shared/components/Badge'
import { Skeleton } from '../../../shared/components/Skeleton'

interface TodayTasksProps {
  tasks: Task[]
  isLoading: boolean
}

/** Displays tasks that are due today with their priority badges. */
export function TodayTasks({ tasks, isLoading }: TodayTasksProps) {
  const { t } = useTranslation()
  const localize = useLocalizedText()

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold text-[var(--foreground)]">
        {t('dashboard.todayTasks')} ({tasks.length})
      </h2>

      {isLoading ? (
        <Skeleton className="h-20 w-full rounded-xl" />
      ) : tasks.length > 0 ? (
        <div className="space-y-2.5">
          {tasks.map((task) => (
            <Card key={task.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                    task.status === 'completed'
                      ? 'bg-[var(--success)]'
                      : 'bg-[var(--primary)]'
                  }`}
                />
                <div className="min-w-0">
                  <p
                    className={`text-sm font-semibold truncate ${
                      task.status === 'completed'
                        ? 'line-through text-[var(--muted-foreground)]'
                        : 'text-[var(--foreground)]'
                    }`}
                  >
                    {localize(task.title)}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                    {task.estimatedMinutes} {t('common.minutesShort')}
                  </p>
                </div>
              </div>
              <Badge variant={PRIORITY_BADGE_VARIANT[task.priority] || 'default'}>
                {t(`priority.${task.priority}`)}
              </Badge>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-5 text-center bg-[var(--surface-subtle)]/40 border-dashed">
          <p className="text-xs text-[var(--muted-foreground)]">
            {t('dashboard.noTasksToday')}
          </p>
        </Card>
      )}
    </div>
  )
}

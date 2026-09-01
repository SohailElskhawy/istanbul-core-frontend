import { useTranslation } from 'react-i18next'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Task } from '../../../shared/types'
import { useLocalizedText } from '../../../shared/hooks/useLocalizedText'
import { PRIORITY_BADGE_VARIANT } from '../../../shared/lib/utils'
import { Card } from '../../../shared/components/Card'
import { Badge } from '../../../shared/components/Badge'
import { Skeleton } from '../../../shared/components/Skeleton'
import { EmptyState } from '../../../shared/components/EmptyState'

interface UpcomingDeadlinesProps {
  tasks: Task[]
  isLoading: boolean
}

/** Shows the next 5 upcoming task deadlines with links to the full tasks page. */
export function UpcomingDeadlines({ tasks, isLoading }: UpcomingDeadlinesProps) {
  const { t } = useTranslation()
  const localize = useLocalizedText()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          {t('dashboard.upcomingDeadlines')}
        </h2>
        <Link
          to="/tasks"
          className="text-xs font-medium text-[var(--primary)] hover:underline inline-flex items-center gap-1"
        >
          <span>{t('dashboard.viewAllTasks')}</span>
          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : tasks.length > 0 ? (
        <div className="space-y-2.5">
          {tasks.map((task) => (
            <Card key={task.id} className="p-4 flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                  {localize(task.title)}
                </p>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  {t('common.dueDate')}:{' '}
                  <span className="font-medium text-[var(--foreground)]">
                    {task.dueDate}
                  </span>
                  {' '}• {task.estimatedMinutes} {t('common.minutesShort')}
                </p>
              </div>
              <Badge variant={PRIORITY_BADGE_VARIANT[task.priority] || 'default'}>
                {t(`priority.${task.priority}`)}
              </Badge>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CheckCircle2}
          title={t('tasks.noTasksTitle')}
          description={t('tasks.noTasksDesc')}
        />
      )}
    </div>
  )
}

import { useTranslation } from 'react-i18next'
import { CheckCircle2, Flame, Clock, Calendar } from 'lucide-react'
import { Card } from '../../../shared/components/Card'
import { Skeleton } from '../../../shared/components/Skeleton'
import type { DashboardStats } from '../../../shared/types'

interface StatsGridProps {
  isLoading: boolean
  incompleteCount: number
  estimatedHours: number
  remainingMins: number
  stats?: DashboardStats
}

/**
 * Displays the 4 key dashboard metrics:
 * pending tasks, study time, completed tasks, and study streak.
 */
export function StatsGrid({
  isLoading,
  incompleteCount,
  estimatedHours,
  remainingMins,
  stats,
}: StatsGridProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      icon: Clock,
      label: t('dashboard.pendingTasks'),
      value: String(incompleteCount),
      colorClass: 'bg-[var(--warning)]/10 text-[var(--warning)]',
    },
    {
      icon: Calendar,
      label: t('dashboard.totalStudyTime'),
      value: `${estimatedHours > 0 ? `${estimatedHours}${t('dashboard.hours')} ` : ''}${remainingMins}${t('common.minutesShort')}`,
      colorClass: 'bg-[var(--primary)]/10 text-[var(--primary)]',
    },
    {
      icon: CheckCircle2,
      label: t('dashboard.completedTasks'),
      value: String(stats?.completedTasks ?? 0),
      colorClass: 'bg-[var(--success)]/10 text-[var(--success)]',
    },
    {
      icon: Flame,
      label: t('dashboard.studyStreak'),
      value: `${stats?.studyStreakDays ?? 0} ${t('dashboard.days')}`,
      colorClass: 'bg-[var(--danger)]/10 text-[var(--danger)]',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.label} className="flex items-center gap-4">
            <div className={`flex items-center justify-center h-11 w-11 rounded-xl shrink-0 ${card.colorClass}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-[var(--muted-foreground)]">
                {card.label}
              </p>
              <p className="text-2xl font-bold text-[var(--foreground)] mt-0.5">
                {card.value}
              </p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

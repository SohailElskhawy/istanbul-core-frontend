import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { PageHeader } from '../../shared/components/PageHeader'
import { Button } from '../../shared/components/Button'
import { useDashboardData } from './hooks/useDashboardData'
import { StatsGrid } from './components/StatsGrid'
import { TodayTasks } from './components/TodayTasks'
import { UpcomingDeadlines } from './components/UpcomingDeadlines'
import { CourseProgress } from './components/CourseProgress'

/**
 * Dashboard page — the app's landing screen.
 * Orchestrates sub-components for stats, today's tasks, deadlines, and course progress.
 */
export function DashboardPage() {
  const { t } = useTranslation()

  const {
    dashboard,
    allTasks,
    isLoading,
    todayTasks,
    incompleteTasks,
    estimatedHours,
    remainingMins,
    upcomingDeadlines,
  } = useDashboardData()

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
        action={
          <Link to="/tasks">
            <Button>
              <Plus className="h-4 w-4" />
              <span>{t('tasks.addTask')}</span>
            </Button>
          </Link>
        }
      />

      <StatsGrid
        isLoading={isLoading}
        incompleteCount={incompleteTasks.length}
        estimatedHours={estimatedHours}
        remainingMins={remainingMins}
        stats={dashboard?.stats}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Today's tasks + Upcoming deadlines */}
        <div className="lg:col-span-2 space-y-6">
          <TodayTasks tasks={todayTasks} isLoading={isLoading} />
          <UpcomingDeadlines tasks={upcomingDeadlines} isLoading={isLoading} />
        </div>

        {/* Right column: Course progress */}
        <CourseProgress
          courses={dashboard?.courses ?? []}
          allTasks={allTasks}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

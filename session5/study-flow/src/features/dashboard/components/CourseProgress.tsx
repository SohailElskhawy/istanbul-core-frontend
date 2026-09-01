import { useTranslation } from 'react-i18next'
import { ArrowRight, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Task, Course } from '../../../shared/types'
import { useLocalizedText } from '../../../shared/hooks/useLocalizedText'
import { Card } from '../../../shared/components/Card'
import { Skeleton } from '../../../shared/components/Skeleton'
import { EmptyState } from '../../../shared/components/EmptyState'
import { CourseBadge } from '../../../shared/components/CourseBadge'
import { ProgressBar } from '../../../shared/components/ProgressBar'

interface CourseProgressProps {
  courses: Course[]
  allTasks: Task[]
  isLoading: boolean
}

/** Sidebar widget showing task completion progress for each course. */
export function CourseProgress({ courses, allTasks, isLoading }: CourseProgressProps) {
  const { t } = useTranslation()
  const localize = useLocalizedText()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          {t('dashboard.quickOverviewTitle')}
        </h2>
        <Link
          to="/courses"
          className="text-xs font-medium text-[var(--primary)] hover:underline inline-flex items-center gap-1"
        >
          <span>{t('nav.courses')}</span>
          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      ) : courses.length > 0 ? (
        <div className="space-y-3">
          {courses.map((course) => {
            const courseTasks = allTasks.filter((task) => task.courseId === course.id)
            const completed = courseTasks.filter((task) => task.status === 'completed').length
            const percent =
              courseTasks.length > 0
                ? Math.round((completed / courseTasks.length) * 100)
                : 0

            return (
              <Card key={course.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <CourseBadge code={course.code} color={course.color} />
                  <span className="text-xs font-bold text-[var(--foreground)]">
                    {percent}%
                  </span>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                    {localize(course.name)}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {completed}/{courseTasks.length} {t('dashboard.tasksCompleted')}
                  </p>
                </div>

                <ProgressBar percent={percent} color={course.color} className="h-1.5" />
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title={t('courses.noCoursesTitle')}
          description={t('courses.noCoursesDesc')}
        />
      )}
    </div>
  )
}

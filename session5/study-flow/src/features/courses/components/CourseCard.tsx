import { useTranslation } from 'react-i18next'
import { User, CheckCircle, Clock } from 'lucide-react'
import type { Course, Task } from '../../../shared/types'
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/Card'
import { Badge } from '../../../shared/components/Badge'
import { CourseBadge } from '../../../shared/components/CourseBadge'
import { ProgressBar } from '../../../shared/components/ProgressBar'
import { useLocalizedText } from '../../../shared/hooks/useLocalizedText'

interface CourseCardProps {
  course: Course
  tasks: Task[]
}

export function CourseCard({ course, tasks }: CourseCardProps) {
  const { t } = useTranslation()
  const localize = useLocalizedText()

  const courseTasks = tasks.filter((task) => task.courseId === course.id)
  const totalTasks = courseTasks.length
  const completedTasks = courseTasks.filter((task) => task.status === 'completed').length
  const incompleteTasks = totalTasks - completedTasks
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const nameText = localize(course.name)
  const instructorText = localize(course.instructor)
  const descriptionText = course.description ? localize(course.description) : ''

  return (
    <Card className="flex flex-col justify-between hover:border-[var(--muted-foreground)]/30 transition-all text-left rtl:text-right">
      <div>
        <CardHeader className="p-0 pb-3">
          <div className="flex items-center justify-between gap-2">
            <CourseBadge code={course.code} color={course.color} />
            {course.credits && (
              <Badge variant="outline">
                {course.credits} {t('courses.creditsLabel')}
              </Badge>
            )}
          </div>
          <CardTitle className="text-base mt-2 line-clamp-1">{nameText}</CardTitle>
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] mt-1">
            <User className="h-3.5 w-3.5" />
            <span>{instructorText}</span>
          </div>
        </CardHeader>

        {descriptionText && (
          <CardContent className="p-0 text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed mb-4">
            {descriptionText}
          </CardContent>
        )}
      </div>

      {/* Progress Bar & Incomplete Tasks */}
      <div className="space-y-3 pt-4 border-t border-[var(--border)]">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--muted-foreground)] font-medium">
              {t('courses.progress')}
            </span>
            <span className="font-bold text-[var(--foreground)]">{progress}%</span>
          </div>
          <ProgressBar percent={progress} color={course.color || 'var(--primary)'} />
        </div>

        <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] pt-1">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-[var(--success)]" />
            <span>
              {completedTasks}/{totalTasks} {t('courses.completed')}
            </span>
          </div>
          {incompleteTasks > 0 && (
            <div className="flex items-center gap-1.5 text-[var(--warning)] font-medium">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {incompleteTasks} {t('courses.pending')}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

import { useTranslation } from 'react-i18next'
import { CheckSquare } from 'lucide-react'
import type { Task, Course, TaskStatus } from '../../../shared/types'
import { TaskCard } from './TaskCard'
import { EmptyState } from '../../../shared/components/EmptyState'
import { Skeleton } from '../../../shared/components/Skeleton'
import { useCourseMap } from '../../../shared/hooks/useCourseMap'

interface TaskListProps {
  tasks: Task[]
  courses: Course[]
  isLoading: boolean
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, newStatus: TaskStatus) => void
  onCreateTaskClick: () => void
}

export function TaskList({
  tasks,
  courses,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
  onCreateTaskClick,
}: TaskListProps) {
  const { t } = useTranslation()
  const courseMap = useCourseMap(courses)

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={CheckSquare}
        title={t('tasks.noTasksTitle')}
        description={t('tasks.noTasksDesc')}
        action={
          <button
            type="button"
            onClick={onCreateTaskClick}
            className="text-xs font-semibold text-[var(--primary)] hover:underline cursor-pointer"
          >
            {t('tasks.createTask')}
          </button>
        }
      />
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          course={courseMap.get(task.courseId)}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  )
}

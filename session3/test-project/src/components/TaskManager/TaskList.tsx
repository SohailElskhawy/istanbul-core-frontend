import {
  type Task,
  type TaskFilter,
  filterTasks,
  sortTasks,
} from '@/lib/tasks'
import EmptyState from './EmptyState'
import TaskItem from './TaskItem'

type TaskListProps = {
  tasks: Task[]
  filter: TaskFilter
  searchQuery: string
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
  onResetFilters: () => void
}

export default function TaskList({
  tasks,
  filter,
  searchQuery,
  onToggle,
  onDelete,
  onEdit,
  onResetFilters,
}: TaskListProps) {
  // First filter, then sort
  const filtered = filterTasks(tasks, filter, searchQuery)
  const sorted = sortTasks(filtered)

  if (tasks.length === 0) {
    return <EmptyState isFiltered={false} />
  }

  if (sorted.length === 0) {
    return (
      <EmptyState
        isFiltered={filter !== 'all'}
        filter={filter}
        hasQuery={Boolean(searchQuery.trim())}
        onResetFilters={onResetFilters}
      />
    )
  }

  return (
    <ul className="space-y-2.5" aria-label="Task list">
      {sorted.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  )
}

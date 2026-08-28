import type { Task, FilterType, PriorityFilterType } from '../types/task';
import { TaskItem } from './TaskItem';
import { EmptyState } from './EmptyState';
import { TaskSkeleton } from './TaskSkeleton';

interface TaskListProps {
  tasks: Task[];
  totalTasks: number;
  isLoading: boolean;
  error: string | null;
  currentFilter: FilterType;
  currentPriorityFilter: PriorityFilterType;
  hasSearchQuery: boolean;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onEditTask: (id: number, newTitle: string) => void;
  onRetry?: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  totalTasks,
  isLoading,
  error,
  currentFilter,
  currentPriorityFilter,
  hasSearchQuery,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onRetry,
}) => {
  // 1. Loading Skeleton
  if (isLoading) {
    return <TaskSkeleton />;
  }

  // 2. Error State
  if (error) {
    return (
      <div className="status-container error-container" role="alert">
        <div className="error-icon" aria-hidden="true">⚠️</div>
        <p className="status-text error-text">{error}</p>
        {onRetry && (
          <button type="button" className="retry-btn" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    );
  }

  // 3. Empty State
  if (tasks.length === 0) {
    return (
      <EmptyState
        filter={currentFilter}
        priorityFilter={currentPriorityFilter}
        totalTasks={totalTasks}
        hasSearchQuery={hasSearchQuery}
      />
    );
  }

  // 4. Task List Render
  return (
    <ul className="task-list" aria-label="Tasks list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggleTask}
          onDelete={onDeleteTask}
          onEdit={onEditTask}
        />
      ))}
    </ul>
  );
};
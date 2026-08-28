import type { Task, FilterType } from '../types/task';
import { TaskItem } from './TaskItem';
import { EmptyState } from './EmptyState';

interface TaskListProps {
  tasks: Task[];
  totalTasks: number;
  isLoading: boolean;
  error: string | null;
  currentFilter: FilterType;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onRetry?: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  totalTasks,
  isLoading,
  error,
  currentFilter,
  onToggleTask,
  onDeleteTask,
  onRetry,
}) => {
  if (isLoading) {
    return (
      <div className="status-container loading-container" role="status">
        <div className="spinner" aria-hidden="true" />
        <p className="status-text">Loading tasks...</p>
      </div>
    );
  }

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

  if (tasks.length === 0) {
    return <EmptyState filter={currentFilter} totalTasks={totalTasks} />;
  }

  return (
    <ul className="task-list" aria-label="Tasks list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggleTask}
          onDelete={onDeleteTask}
        />
      ))}
    </ul>
  );
};
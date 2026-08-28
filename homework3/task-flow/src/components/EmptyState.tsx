import type { FilterType } from '../types/task';

interface EmptyStateProps {
  filter: FilterType;
  totalTasks: number;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  filter,
  totalTasks,
}) => {
  const getMessage = () => {
    if (totalTasks === 0) {
      return {
        title: 'No tasks found',
        description: 'You have no tasks in your list. Add one above to get started!',
        icon: '📝',
      };
    }

    switch (filter) {
      case 'completed':
        return {
          title: 'No completed tasks yet',
          description: 'Mark tasks as completed to see them listed here.',
          icon: '⏳',
        };
      case 'pending':
        return {
          title: 'No pending tasks!',
          description: 'Great job! You have completed all of your tasks.',
          icon: '🎉',
        };
      default:
        return {
          title: 'No tasks match your criteria',
          description: 'Try adding or changing your filters.',
          icon: '🔍',
        };
    }
  };

  const message = getMessage();

  return (
    <div className="empty-state" role="status">
      <div className="empty-state-icon" aria-hidden="true">{message.icon}</div>
      <h3 className="empty-state-title">{message.title}</h3>
      <p className="empty-state-description">{message.description}</p>
    </div>
  );
};
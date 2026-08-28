import type { FilterType, PriorityFilterType } from '../types/task';

interface EmptyStateProps {
  filter: FilterType;
  priorityFilter: PriorityFilterType;
  totalTasks: number;
  hasSearchQuery?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  filter,
  priorityFilter,
  totalTasks,
  hasSearchQuery,
}) => {
  const getMessage = () => {
    if (totalTasks === 0) {
      return {
        title: 'No Tasks Found',
        description: 'Your task list is empty. Add a new task above or click "Reset API" to load sample data!',
        icon: '📝',
      };
    }

    if (hasSearchQuery) {
      return {
        title: 'No Matching Results',
        description: 'No tasks match your search keywords. Try clearing the search box.',
        icon: '🔍',
      };
    }

    if (priorityFilter !== 'all') {
      return {
        title: `No ${priorityFilter.toUpperCase()} Priority Tasks`,
        description: `You don't have any ${priorityFilter} priority tasks in this view.`,
        icon: '🎯',
      };
    }

    switch (filter) {
      case 'completed':
        return {
          title: 'No Completed Tasks',
          description: 'Check off tasks as you finish them to see them listed here.',
          icon: '⏳',
        };
      case 'pending':
        return {
          title: 'All Tasks Completed!',
          description: 'Awesome job! You have cleared all pending items.',
          icon: '🎉',
        };
      default:
        return {
          title: 'No Tasks Match',
          description: 'Try adjusting your filters.',
          icon: '⚡',
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
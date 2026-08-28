import type { FilterType, PriorityFilterType } from '../types/task';

interface TaskFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  currentPriorityFilter: PriorityFilterType;
  onPriorityFilterChange: (priority: PriorityFilterType) => void;
  counts?: {
    all: number;
    pending: number;
    completed: number;
  };
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  currentFilter,
  onFilterChange,
  currentPriorityFilter,
  onPriorityFilterChange,
  counts,
}) => {
  const statusFilters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'completed', label: 'Completed' },
  ];

  const priorityFilters: { key: PriorityFilterType; label: string }[] = [
    { key: 'all', label: 'All Priorities' },
    { key: 'high', label: '🔴 High' },
    { key: 'medium', label: '🟡 Med' },
    { key: 'low', label: '🟢 Low' },
  ];

  return (
    <div className="task-filters-wrapper">
      {/* 1. Status Filter Tabs */}
      <nav className="task-filters" aria-label="Filter tasks by status">
        <div className="filter-button-group" role="tablist">
          {statusFilters.map(({ key, label }) => {
            const isActive = currentFilter === key;
            const count = counts ? counts[key] : undefined;

            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`filter-btn ${isActive ? 'active' : ''}`}
                onClick={() => onFilterChange(key)}
              >
                <span className="filter-label">{label}</span>
                {count !== undefined && (
                  <span className="filter-count">{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 2. Priority Filter Bar */}
      <div className="priority-filter-group" aria-label="Filter by priority">
        <span className="priority-filter-label">Priority:</span>
        {priorityFilters.map(({ key, label }) => {
          const isActive = currentPriorityFilter === key;
          return (
            <button
              key={key}
              type="button"
              className={`priority-filter-btn ${isActive ? 'active' : ''}`}
              onClick={() => onPriorityFilterChange(key)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
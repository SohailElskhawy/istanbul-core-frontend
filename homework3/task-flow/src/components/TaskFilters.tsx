import type { FilterType } from '../types/task';

interface TaskFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts?: {
    all: number;
    pending: number;
    completed: number;
  };
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  currentFilter,
  onFilterChange,
  counts,
}) => {
  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <nav className="task-filters" aria-label="Filter tasks">
      <div className="filter-button-group" role="tablist">
        {filters.map(({ key, label }) => {
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
  );
};
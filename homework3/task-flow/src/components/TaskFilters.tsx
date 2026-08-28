import type { FilterType, PriorityFilterType } from '../types/task';
import { STATUS_FILTERS, PRIORITY_FILTERS } from '../constants/taskConfig';

interface TaskFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  currentPriorityFilter: PriorityFilterType;
  onPriorityFilterChange: (priority: PriorityFilterType) => void;
  counts: {
    all: number;
    pending: number;
    completed: number;
  };
}

export function TaskFilters({
  currentFilter,
  onFilterChange,
  currentPriorityFilter,
  onPriorityFilterChange,
  counts,
}: TaskFiltersProps) {
  return (
    <div className="task-filters-wrapper">
      {/* 1. Status Filter Tabs */}
      <nav className="task-filters" aria-label="Filter tasks by status">
        <div className="filter-button-group" role="tablist">
          {STATUS_FILTERS.map(({ key, label }) => {
            const isActive = currentFilter === key;
            const count = counts[key];

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
                <span className="filter-count">{count}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 2. Priority Filter Bar */}
      <div className="priority-filter-group" aria-label="Filter by priority">
        <span className="priority-filter-label">Priority:</span>
        {PRIORITY_FILTERS.map(({ key, label }) => {
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
}
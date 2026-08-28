import { useState, useMemo } from 'react';
import type { Task, FilterType, PriorityFilterType } from '../types/task';

export function useTaskFilters(tasks: Task[]) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilterType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Summary Statistics Computation
  const summary = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const remaining = total - completed;

    return {
      total,
      completed,
      remaining,
      counts: {
        all: total,
        pending: remaining,
        completed,
      },
    };
  }, [tasks]);

  // 2. Filtered Tasks Memoization
  const filteredTasks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      // Status Filter
      if (filter === 'completed' && !task.completed) return false;
      if (filter === 'pending' && task.completed) return false;

      // Priority Filter
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

      // Search Query Filter
      if (normalizedQuery && !task.todo.toLowerCase().includes(normalizedQuery)) {
        return false;
      }

      return true;
    });
  }, [tasks, filter, priorityFilter, searchQuery]);

  return {
    filter,
    setFilter,
    priorityFilter,
    setPriorityFilter,
    searchQuery,
    setSearchQuery,
    filteredTasks,
    summary,
  };
}

import type { FilterType, PriorityFilterType, PriorityLevel } from '../types/task';

export const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks_v2',
  THEME: 'taskflow_theme',
} as const;

export const API_CONFIG = {
  TODOS_URL: 'https://dummyjson.com/todos',
} as const;

export const DEFAULT_PRIORITIES: readonly PriorityLevel[] = ['low', 'medium', 'high'] as const;

export interface PriorityInfo {
  label: string;
  icon: string;
  badgeClass: string;
  displayText: string;
}

export const PRIORITY_CONFIG: Record<PriorityLevel, PriorityInfo> = {
  low: {
    label: 'Low',
    icon: '🟢',
    badgeClass: 'priority-low',
    displayText: '🟢 Low',
  },
  medium: {
    label: 'Med',
    icon: '🟡',
    badgeClass: 'priority-medium',
    displayText: '🟡 Med',
  },
  high: {
    label: 'High',
    icon: '🔴',
    badgeClass: 'priority-high',
    displayText: '🔴 High',
  },
};

export const STATUS_FILTERS: ReadonlyArray<{ key: FilterType; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
] as const;

export const PRIORITY_FILTERS: ReadonlyArray<{ key: PriorityFilterType; label: string }> = [
  { key: 'all', label: 'All Priorities' },
  { key: 'high', label: '🔴 High' },
  { key: 'medium', label: '🟡 Med' },
  { key: 'low', label: '🟢 Low' },
] as const;

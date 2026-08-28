import type { Task, ThemeMode } from '../types/task';

/**
 * Validates if an unknown object matches the Task interface shape.
 */
export function isTask(item: unknown): item is Task {
  if (typeof item !== 'object' || item === null) return false;
  const t = item as Record<string, unknown>;
  return (
    typeof t.id === 'number' &&
    typeof t.todo === 'string' &&
    typeof t.completed === 'boolean' &&
    (t.priority === 'low' || t.priority === 'medium' || t.priority === 'high') &&
    typeof t.createdAt === 'string'
  );
}

/**
 * Validates if an unknown array is an array of Tasks.
 */
export function isTaskArray(items: unknown): items is Task[] {
  return Array.isArray(items) && items.every(isTask);
}

export const storage = {
  getTasks(key: string): Task[] | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return null;
      const parsed = JSON.parse(item);
      if (isTaskArray(parsed)) {
        return parsed;
      }
      return null;
    } catch (e) {
      console.warn(`[storage] Failed to parse tasks from localStorage key "${key}":`, e);
      return null;
    }
  },

  setTasks(key: string, tasks: Task[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(tasks));
    } catch (e) {
      console.error(`[storage] Failed to save tasks to localStorage key "${key}":`, e);
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[storage] Failed to remove item with key "${key}":`, e);
    }
  },

  getTheme(key: string): ThemeMode | null {
    try {
      const saved = localStorage.getItem(key);
      if (saved === 'dark' || saved === 'light') return saved;
      return null;
    } catch {
      return null;
    }
  },

  setTheme(key: string, theme: ThemeMode): void {
    try {
      localStorage.setItem(key, theme);
    } catch (e) {
      console.error(`[storage] Failed to save theme to localStorage:`, e);
    }
  },
};

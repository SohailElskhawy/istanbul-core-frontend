import { useState, useEffect, useCallback } from 'react';
import type { Task, PriorityLevel } from '../types/task';
import { STORAGE_KEYS } from '../constants/taskConfig';
import { storage } from '../utils/storage';
import { formatTaskDate } from '../utils/dateUtils';
import { fetchInitialTasks } from '../api/taskApi';

export function useTaskManager() {
  // 1. Initial State Initialization with Lazy Storage Check
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = storage.getTasks(STORAGE_KEYS.TASKS);
    return saved !== null ? saved : [];
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    const saved = storage.getTasks(STORAGE_KEYS.TASKS);
    return saved === null;
  });

  const [error, setError] = useState<string | null>(null);

  // 2. Fetch initial tasks from API only on first visit (when storage is null)
  useEffect(() => {
    const saved = storage.getTasks(STORAGE_KEYS.TASKS);
    if (saved !== null) {
      return;
    }

    const controller = new AbortController();

    async function loadTasks() {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedTasks = await fetchInitialTasks(controller.signal);
        setTasks(fetchedTasks);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        console.error('Failed to load initial tasks from API:', err);
        setError('Something went wrong while loading tasks. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();

    return () => {
      controller.abort();
    };
  }, []);

  // 3. Auto-save tasks to localStorage whenever tasks state updates (and not loading)
  useEffect(() => {
    if (!isLoading) {
      storage.setTasks(STORAGE_KEYS.TASKS, tasks);
    }
  }, [tasks, isLoading]);

  // 4. Stable Action Handlers
  const addTask = useCallback((title: string, priority: PriorityLevel) => {
    const newTask: Task = {
      id: Date.now(),
      todo: title,
      completed: false,
      priority,
      createdAt: formatTaskDate(),
    };

    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const toggleTask = useCallback((id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const editTask = useCallback((id: number, newTitle: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, todo: newTitle } : task
      )
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  }, []);

  const resetFromApi = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    storage.remove(STORAGE_KEYS.TASKS);

    try {
      const freshTasks = await fetchInitialTasks();
      setTasks(freshTasks);
    } catch (err) {
      console.error('Failed to reset tasks from API:', err);
      setError('Something went wrong while resetting tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    tasks,
    isLoading,
    error,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    clearCompleted,
    resetFromApi,
  };
}

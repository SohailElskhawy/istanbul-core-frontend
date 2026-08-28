import { API_CONFIG, DEFAULT_PRIORITIES } from '../constants/taskConfig';
import type { DummyJsonTodosResponse, Task } from '../types/task';
import { formatTaskDate } from '../utils/dateUtils';

/**
 * Maps raw DummyJSON todos response items to our strongly-typed Task model.
 */
export function mapDummyJsonTodosToTasks(response: DummyJsonTodosResponse): Task[] {
  const todos = response.todos || [];
  const defaultDate = formatTaskDate();

  return todos.map((item, index) => ({
    id: item.id,
    todo: item.todo,
    completed: item.completed,
    priority: DEFAULT_PRIORITIES[index % DEFAULT_PRIORITIES.length],
    createdAt: defaultDate,
    userId: item.userId,
  }));
}

/**
 * Fetches sample todos from DummyJSON API with AbortSignal support.
 */
export async function fetchInitialTasks(signal?: AbortSignal): Promise<Task[]> {
  const response = await fetch(API_CONFIG.TODOS_URL, { signal });
  
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  }

  const data: DummyJsonTodosResponse = await response.json();
  return mapDummyJsonTodosToTasks(data);
}

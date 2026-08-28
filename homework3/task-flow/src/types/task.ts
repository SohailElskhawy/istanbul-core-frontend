export type PriorityLevel = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  todo: string;
  completed: boolean;
  priority: PriorityLevel;
  createdAt: string;
  userId?: number;
}

export type FilterType = 'all' | 'pending' | 'completed';
export type PriorityFilterType = 'all' | PriorityLevel;
export type ThemeMode = 'light' | 'dark';

export interface DummyJsonTodo {
  id: number;
  todo: string;
  completed: boolean;
  userId?: number;
}

export interface DummyJsonTodosResponse {
  todos: DummyJsonTodo[];
  total: number;
  skip: number;
  limit: number;
}
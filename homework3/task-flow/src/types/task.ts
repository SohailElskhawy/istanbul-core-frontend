export interface Task {
  id: number;
  todo: string;
  completed: boolean;
  userId?: number;
}

export type FilterType = 'all' | 'pending' | 'completed';

export interface DummyJsonTodosResponse {
  todos: Task[];
  total: number;
  skip: number;
  limit: number;
}
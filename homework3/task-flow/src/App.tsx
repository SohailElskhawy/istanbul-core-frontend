import { useState, useEffect, useCallback } from 'react';
import type { Task, FilterType, PriorityFilterType, PriorityLevel, ThemeMode, DummyJsonTodosResponse } from './types/task';
import { Header } from './components/Header';
import { TaskSummary } from './components/TaskSummary';
import { AddTaskForm } from './components/AddTaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import './App.css';

const API_URL = 'https://dummyjson.com/todos';
const STORAGE_TASKS_KEY = 'taskflow_tasks_v2';
const STORAGE_THEME_KEY = 'taskflow_theme';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilterType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Theme Management (Bonus)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 2. Fetch Initial Tasks from DummyJSON API
  const fetchTasksFromApi = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data: DummyJsonTodosResponse = await response.json();
      
      // Map API todos into our Task schema with priorities and formatted dates
      const priorities: PriorityLevel[] = ['low', 'medium', 'high'];
      const mappedTasks: Task[] = (data.todos || []).map((item, index) => ({
        id: item.id,
        todo: item.todo,
        completed: item.completed,
        priority: priorities[index % 3],
        createdAt: 'Initial API',
        userId: item.userId,
      }));

      setTasks(mappedTasks);
      localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(mappedTasks));
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Something went wrong while loading tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Initial Load: Check localStorage or fetch from API
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_TASKS_KEY);
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTasks(parsed);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn('Corrupted tasks in localStorage. Reloading from API...', e);
      }
    }

    fetchTasksFromApi();
  }, [fetchTasksFromApi]);

  // 4. Auto-save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(tasks));
    }
  }, [tasks, loading]);

  // 5. Reset API Handler
  const handleResetApi = () => {
    localStorage.removeItem(STORAGE_TASKS_KEY);
    fetchTasksFromApi();
  };

  // 6. Pure Immutable Action Handlers
  const handleAddTask = (title: string, priority: PriorityLevel) => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newTask: Task = {
      id: Date.now(),
      todo: title,
      completed: false,
      priority,
      createdAt: `Today, ${formattedTime}`,
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const handleToggleTask = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleEditTask = (id: number, newTitle: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, todo: newTitle } : task
      )
    );
  };

  const handleClearCompleted = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
  };

  // 7. Derived State (Computed on-the-fly)
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const remainingTasks = totalTasks - completedTasks;

  // Filter tasks by status, priority, and search query
  const filteredTasks = tasks.filter((task) => {
    // Status Filter
    if (filter === 'completed' && !task.completed) return false;
    if (filter === 'pending' && task.completed) return false;

    // Priority Filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

    // Search Query Filter
    if (
      searchQuery.trim() &&
      !task.todo.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="app-container">
      <main className="app-card">
        {/* Requirement 1 & Bonus: Header with Theme Toggle and API Reset */}
        <Header
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onResetApi={handleResetApi}
        />

        {/* Requirement 2: Task Summary */}
        <TaskSummary
          total={totalTasks}
          completed={completedTasks}
          remaining={remainingTasks}
        />

        {/* Requirement 3 & Bonus: Add Task Form with Priority */}
        <section className="app-section">
          <AddTaskForm onAddTask={handleAddTask} />
        </section>

        {/* Controls Section: Search & Filters */}
        <section className="app-section controls-section">
          <div className="controls-row">
            {/* Search Box */}
            <div className="search-box">
              <svg
                className="search-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search tasks by title"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Requirement 7 & Bonus: Task Filters & Priority Filter */}
          <TaskFilters
            currentFilter={filter}
            onFilterChange={setFilter}
            currentPriorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            counts={{
              all: totalTasks,
              pending: remainingTasks,
              completed: completedTasks,
            }}
          />
        </section>

        {/* Bulk Action & Showing Stats */}
        <div className="bulk-actions-bar">
          <span className="showing-text">
            Showing {filteredTasks.length} of {totalTasks} tasks
          </span>

          {completedTasks > 0 && (
            <button
              type="button"
              className="clear-completed-btn"
              onClick={handleClearCompleted}
            >
              Clear Completed ({completedTasks})
            </button>
          )}
        </div>

        {/* Requirements 4, 5, 6, 8, 9, 10 & Bonus: Skeletons, Tasks, Edit, Delete */}
        <section className="app-section list-section">
          <TaskList
            tasks={filteredTasks}
            totalTasks={totalTasks}
            isLoading={loading}
            error={error}
            currentFilter={filter}
            currentPriorityFilter={priorityFilter}
            hasSearchQuery={Boolean(searchQuery.trim())}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onRetry={fetchTasksFromApi}
          />
        </section>
      </main>

      <footer className="app-footer">
        <p>TaskFlow &bull; Neobrutalism Design System &bull; React + TypeScript</p>
      </footer>
    </div>
  );
}

export default App;
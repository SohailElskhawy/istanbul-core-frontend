import { useState, useEffect, useCallback } from 'react';
import type { Task, FilterType, DummyJsonTodosResponse } from './types/task';
import { Header } from './components/Header';
import { TaskSummary } from './components/TaskSummary';
import { AddTaskForm } from './components/AddTaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import './App.css';

const API_URL = 'https://dummyjson.com/todos';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Initial Data Fetching with useEffect
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data: DummyJsonTodosResponse = await response.json();
      
      // Store API tasks in state
      setTasks(data.todos || []);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Something went wrong while loading tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // 2. Immutable Handlers
  const handleAddTask = (title: string) => {
    const newTask: Task = {
      id: Date.now(), // Generate a unique timestamp-based ID
      todo: title,
      completed: false,
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

  const handleFilterChange = (selectedFilter: FilterType) => {
    setFilter(selectedFilter);
  };

  const handleClearCompleted = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
  };

  // 3. Derived State (Computed on-the-fly)
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const remainingTasks = totalTasks - completedTasks;

  // Filter tasks by status and search query
  const filteredTasks = tasks.filter((task) => {
    // Status Filter
    if (filter === 'completed' && !task.completed) return false;
    if (filter === 'pending' && task.completed) return false;

    // Search Filter (Bonus)
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
        {/* Requirement 1: Header */}
        <Header />

        {/* Requirement 2: Task Summary */}
        <TaskSummary
          total={totalTasks}
          completed={completedTasks}
          remaining={remainingTasks}
        />

        {/* Requirement 3: Add Task Form */}
        <section className="app-section">
          <AddTaskForm onAddTask={handleAddTask} />
        </section>

        {/* Controls: Filters & Search */}
        <section className="app-section controls-section">
          <div className="search-box">
            <svg
              className="search-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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
                aria-label="Clear search query"
              >
                ✕
              </button>
            )}
          </div>

          {/* Requirement 7: Task Filters */}
          <TaskFilters
            currentFilter={filter}
            onFilterChange={handleFilterChange}
            counts={{
              all: totalTasks,
              pending: remainingTasks,
              completed: completedTasks,
            }}
          />
        </section>

        {/* Clear Completed Action (Bonus) */}
        {completedTasks > 0 && (
          <div className="bulk-actions">
            <button
              type="button"
              className="clear-completed-btn"
              onClick={handleClearCompleted}
            >
              Clear Completed ({completedTasks})
            </button>
          </div>
        )}

        {/* Requirements 4, 5, 6, 8, 9, 10: Task List, Statuses, Empty States */}
        <section className="app-section list-section">
          <TaskList
            tasks={filteredTasks}
            totalTasks={totalTasks}
            isLoading={loading}
            error={error}
            currentFilter={filter}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onRetry={fetchTasks}
          />
        </section>
      </main>

      <footer className="app-footer">
        <p>Built with React & TypeScript for Session 3 Assignment</p>
      </footer>
    </div>
  );
}

export default App;
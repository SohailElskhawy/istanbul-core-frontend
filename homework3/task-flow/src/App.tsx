import { Header } from './components/Header';
import { TaskSummary } from './components/TaskSummary';
import { AddTaskForm } from './components/AddTaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { useTaskManager } from './hooks/useTaskManager';
import { useTaskFilters } from './hooks/useTaskFilters';
import { useTheme } from './hooks/useTheme';
import './App.css';

export function App() {
  // 1. Theme Management (SRP - Isolated Hook)
  const { theme, toggleTheme } = useTheme();

  // 2. Task State & Operations (SRP / DIP - Isolated Hook)
  const {
    tasks,
    isLoading,
    error,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    clearCompleted,
    resetFromApi,
  } = useTaskManager();

  // 3. Search & Filter Derivations (SRP - Isolated Hook)
  const {
    filter,
    setFilter,
    priorityFilter,
    setPriorityFilter,
    searchQuery,
    setSearchQuery,
    filteredTasks,
    summary,
  } = useTaskFilters(tasks);

  return (
    <div className="app-container">
      <main className="app-card">
        {/* Header with Theme Toggle & API Reset */}
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          onResetApi={resetFromApi}
        />

        {/* Task Summary Metrics */}
        <TaskSummary
          total={summary.total}
          completed={summary.completed}
          remaining={summary.remaining}
        />

        {/* Add Task Form with Priority Selection */}
        <section className="app-section">
          <AddTaskForm onAddTask={addTask} />
        </section>

        {/* Controls Section: Search Box & Filters */}
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
                  aria-label="Clear search query"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Task Filters & Priority Bar */}
          <TaskFilters
            currentFilter={filter}
            onFilterChange={setFilter}
            currentPriorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            counts={summary.counts}
          />
        </section>

        {/* Bulk Actions & Showing Counter */}
        <div className="bulk-actions-bar">
          <span className="showing-text">
            Showing {filteredTasks.length} of {summary.total} tasks
          </span>

          {summary.completed > 0 && (
            <button
              type="button"
              className="clear-completed-btn"
              onClick={clearCompleted}
            >
              Clear Completed ({summary.completed})
            </button>
          )}
        </div>

        {/* Task List / Skeletons / Empty State */}
        <section className="app-section list-section">
          <TaskList
            tasks={filteredTasks}
            totalTasks={summary.total}
            isLoading={isLoading}
            error={error}
            currentFilter={filter}
            currentPriorityFilter={priorityFilter}
            hasSearchQuery={Boolean(searchQuery.trim())}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onEditTask={editTask}
            onRetry={resetFromApi}
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
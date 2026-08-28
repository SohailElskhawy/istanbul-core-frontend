# TaskFlow - Component Planning & Architecture

## AI Prompt (Task 1)
> **Prompt:** "Analyze this Task Manager interface and suggest a React component hierarchy. Explain each component's responsibility, parent-child relationships, reusable elements, and required props. Do not write the implementation code."

---

## 1. High-Level Architecture & Component Hierarchy

```text
App (Root Component - Orchestrator)
│
├── Custom Hooks & Services Layer
│   ├── useTaskManager (State, CRUD, API loading & LocalStorage sync)
│   ├── useTaskFilters (Status/Priority filtering, search & memoized metrics)
│   ├── useTheme (Theme state & DOM .dark class sync)
│   ├── taskApi (DummyJSON API network fetching & response mapping)
│   ├── storage (Type-safe LocalStorage wrapper with runtime type guards)
│   ├── dateUtils (Standardized timestamp formatting)
│   └── taskConfig (Centralized domain constants: PRIORITY_CONFIG, STATUS_FILTERS)
│
├── Header (Stateless branding & API reset trigger)
│   └── ThemeToggle (Light/Dark mode button)
│
├── TaskSummary (Metrics & statistics presentation cards)
│
├── AddTaskForm (Input handling, priority selection & validation)
│
├── TaskFilters (Status filter tabs & priority filter pills)
│
└── TaskList (Container & list rendering switcher)
    │
    ├── TaskSkeleton (Chunky Neobrutalist skeleton placeholder cards)
    │
    ├── TaskItem [React.memo] (Individual task card/row with inline edit & delete)
    │
    └── EmptyState (Context-aware fallback when no tasks match)
```

---

## 2. Component Breakdown & Responsibilities

### 1. `App` (`src/App.tsx`)
- **Role:** Top-level application orchestrator.
- **Responsibilities:**
  - Composes `useTaskManager`, `useTaskFilters`, and `useTheme`.
  - Connects derived state and action handlers to child components.
  - Keeps presentation code completely decoupled from business logic and I/O.
- **Props:** None.

---

### 2. `Header` (`src/components/Header.tsx`)
- **Role:** Displays brand identity, tagline, API Reset action, and Theme Switcher.
- **Parent:** `App`
- **Children:** `ThemeToggle`
- **Responsibilities:**
  - Renders application name (`TaskFlow`) and description (`Organize your tasks. Stay productive.`).
  - Provides a "Reset API" button that wipes local storage and re-fetches sample data from DummyJSON.
- **Props:**
  ```typescript
  interface HeaderProps {
    title?: string;
    subtitle?: string;
    theme: ThemeMode;
    onToggleTheme: () => void;
    onResetApi: () => void;
  }
  ```

---

### 3. `ThemeToggle` (`src/components/ThemeToggle.tsx`)
- **Role:** Interactive toggle button for switching between Light and Dark themes.
- **Parent:** `Header`
- **Children:** None
- **Responsibilities:**
  - Displays dynamic sun/moon SVG icons and text label (`Light` / `Dark`).
  - Provides accessible `aria-label` and `title` attributes.
- **Props:**
  ```typescript
  interface ThemeToggleProps {
    theme: ThemeMode;
    onToggle: () => void;
  }
  ```

---

### 4. `TaskSummary` (`src/components/TaskSummary.tsx`)
- **Role:** Displays quick statistics of the current task workload.
- **Parent:** `App`
- **Children:** None
- **Responsibilities:**
  - Renders 3 statistic cards:
    - **Total Tasks**
    - **Completed Tasks**
    - **Remaining Tasks**
- **Props:**
  ```typescript
  interface TaskSummaryProps {
    total: number;
    completed: number;
    remaining: number;
  }
  ```

---

### 5. `AddTaskForm` (`src/components/AddTaskForm.tsx`)
- **Role:** Captures user input to create and submit a new task with a chosen priority.
- **Parent:** `App`
- **Children:** None
- **Responsibilities:**
  - Manages internal local state for `title`, `priority`, and `inputError`.
  - Validates that the input is non-empty after `trim()`.
  - Emits `onAddTask(trimmedTitle, priority)` and clears the form upon valid submission.
  - Implements WCAG 2.1 AA accessibility with `.sr-only` labels, `aria-invalid`, and `aria-describedby`.
- **Props:**
  ```typescript
  interface AddTaskFormProps {
    onAddTask: (title: string, priority: PriorityLevel) => void;
  }
  ```

---

### 6. `TaskFilters` (`src/components/TaskFilters.tsx`)
- **Role:** Provides interactive filter buttons for switching views by status and priority.
- **Parent:** `App`
- **Children:** None
- **Responsibilities:**
  - Renders status filter tabs (`All`, `Pending`, `Completed`) with real-time count badges.
  - Renders priority filter pills (`All Priorities`, `🔴 High`, `🟡 Med`, `🟢 Low`) driven by `PRIORITY_FILTERS`.
  - Emits filter changes via `onFilterChange` and `onPriorityFilterChange`.
- **Props:**
  ```typescript
  interface TaskFiltersProps {
    currentFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    currentPriorityFilter: PriorityFilterType;
    onPriorityFilterChange: (priority: PriorityFilterType) => void;
    counts: {
      all: number;
      pending: number;
      completed: number;
    };
  }
  ```

---

### 7. `TaskList` (`src/components/TaskList.tsx`)
- **Role:** Container for rendering the list of tasks or displaying loading/error/empty feedback.
- **Parent:** `App`
- **Children:** `TaskItem`, `TaskSkeleton`, `EmptyState`
- **Responsibilities:**
  - If `isLoading === true`: renders `<TaskSkeleton />`.
  - If `error !== null`: renders an error alert banner with a "Try Again" button.
  - If `tasks.length === 0`: renders `<EmptyState />`.
  - If `tasks.length > 0`: maps over `tasks` and renders `<TaskItem />` for each task using `task.id` as the unique `key`.
- **Props:**
  ```typescript
  interface TaskListProps {
    tasks: Task[];
    totalTasks: number;
    isLoading: boolean;
    error: string | null;
    currentFilter: FilterType;
    currentPriorityFilter: PriorityFilterType;
    hasSearchQuery: boolean;
    onToggleTask: (id: number) => void;
    onDeleteTask: (id: number) => void;
    onEditTask: (id: number, newTitle: string) => void;
    onRetry?: () => void;
  }
  ```

---

### 8. `TaskItem` (`src/components/TaskItem.tsx`)
- **Role:** Memoized card representing a single task item.
- **Parent:** `TaskList`
- **Children:** None
- **Responsibilities:**
  - Displays task title with completion styling (strikethrough / muted color).
  - Displays priority badge and formatted creation timestamp (`formatTaskDate`).
  - Supports inline editing (Save `✓`, Cancel `✕`, `Enter`, `Escape`).
  - Wrapped in `React.memo` to eliminate cascading re-renders across the list.
- **Props:**
  ```typescript
  interface TaskItemProps {
    task: Task;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onEdit: (id: number, newTitle: string) => void;
  }
  ```

---

### 9. `TaskSkeleton` (`src/components/TaskSkeleton.tsx`) & `EmptyState` (`src/components/EmptyState.tsx`)
- **`TaskSkeleton`:** Renders 4 animated Neobrutalist placeholder cards that match real task card geometry during fetch.
- **`EmptyState`:** Renders context-aware feedback (e.g. "No tasks found", "No completed tasks yet", "No matching search results").

---

## 3. TypeScript Data Contracts (`src/types/task.ts`)

```typescript
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
```

---

## 4. State Management & Data Flow Justification

| State | Location | Why It Lives There |
| :--- | :--- | :--- |
| `tasks` (`Task[]`) | `useTaskManager` (App) | Shared between `TaskSummary` (metrics), `AddTaskForm` (adding), and `TaskList` (displaying/toggling/deleting). |
| `filter` (`FilterType`) | `useTaskFilters` (App) | Controls which tasks `TaskList` displays and which filter button `TaskFilters` highlights. |
| `priorityFilter` (`PriorityFilterType`) | `useTaskFilters` (App) | Controls priority filtering across `TaskList` and `TaskFilters`. |
| `searchQuery` (`string`) | `useTaskFilters` (App) | Filter criterion shared between search input and `TaskList`. |
| `theme` (`ThemeMode`) | `useTheme` (App) | Global visual state controlling `.dark` class on `document.documentElement` and `localStorage`. |
| `isLoading` / `error` | `useTaskManager` (App) | Controls whether `TaskList` renders loading skeletons, error banners, or task cards. |
| `title`, `priority`, `inputError` | `AddTaskForm` | Isolated form input state; prevents application-wide re-renders during typing. |
| `isEditing`, `editTitle` | `TaskItem` | Local inline edit state; prevents editing one task from re-rendering sibling tasks. |

### Derived State (Computed via `useMemo`):
- **`summary.total`**: `tasks.length`
- **`summary.completed`**: `tasks.filter(t => t.completed).length`
- **`summary.remaining`**: `total - completed`
- **`filteredTasks`**: Filtered array computed based on `filter`, `priorityFilter`, and `searchQuery`.
# TaskFlow - Component Planning & Architecture

## AI Prompt (Task 1)
> **Prompt:** "Analyze this Task Manager interface and suggest a React component hierarchy. Explain each component's responsibility, parent-child relationships, reusable elements, and required props. Do not write the implementation code."

---

## 1. High-Level Component Hierarchy

```text
App (Root Component - State Owner)
│
├── Header (Stateless presentation)
│
├── TaskSummary (Metrics & Statistics presentation)
│
├── AddTaskForm (Input handling & submission)
│
├── TaskFilters (Filter controls & selection)
│
└── TaskList (Container & list rendering)
    │
    ├── TaskItem (Individual task card/row - reusable)
    │
    └── EmptyState (Fallback display when no tasks match)
```

---

## 2. Component Breakdown & Responsibilities

### 1. `App` (`src/App.tsx`)
- **Role:** Root component and single source of truth for global task state.
- **Parent:** None (Top-level application component).
- **Children:** `Header`, `TaskSummary`, `AddTaskForm`, `TaskFilters`, `TaskList`.
- **Responsibilities:**
  - Holds and manages the main application states (`tasks`, `filter`, `loading`, `error`).
  - Fetches initial tasks from `https://dummyjson.com/todos` on initial mount via `useEffect`.
  - Implements immutable state updater functions:
    - `handleAddTask(title: string): void`
    - `handleToggleTask(id: number): void`
    - `handleDeleteTask(id: number): void`
    - `handleFilterChange(filter: FilterType): void`
  - Calculates derived data (total, completed, remaining tasks, and filtered task list).
  - Passes state and handlers down to child components via props.
- **Props:** None.

---

### 2. `Header` (`src/components/Header.tsx`)
- **Role:** Displays the brand identity and tagline of the application.
- **Parent:** `App`
- **Children:** None
- **Responsibilities:**
  - Renders application name (`TaskFlow`) and description (`Organize your tasks. Stay productive.`).
  - Clean, static visual presentation.
- **Props:**
  ```typescript
  interface HeaderProps {
    title?: string;
    subtitle?: string;
  }
  ```
  *(Props can be optional with default fallback values to make the component reusable across different views).*

---

### 3. `TaskSummary` (`src/components/TaskSummary.tsx`)
- **Role:** Displays quick statistics of the current task workload.
- **Parent:** `App`
- **Children:** None
- **Responsibilities:**
  - Renders 3 statistic cards/badges:
    - **Total tasks**
    - **Completed tasks**
    - **Remaining tasks**
  - Displays values dynamically passed from the parent.
- **Props:**
  ```typescript
  interface TaskSummaryProps {
    total: number;
    completed: number;
    remaining: number;
  }
  ```

---

### 4. `AddTaskForm` (`src/components/AddTaskForm.tsx`)
- **Role:** Captures user input to create and submit a new task.
- **Parent:** `App`
- **Children:** None
- **Responsibilities:**
  - Manages internal local state for the input field (`title: string`).
  - Validates that the input is not empty or pure whitespace.
  - Handles `onSubmit` event, calls parent's `onAddTask(trimmedTitle)` callback, and resets the input field.
- **Props:**
  ```typescript
  interface AddTaskFormProps {
    onAddTask: (title: string) => void;
  }
  ```
- **Local State:**
  - `title: string` (controlled input value).

---

### 5. `TaskFilters` (`src/components/TaskFilters.tsx`)
- **Role:** Provides interactive filter buttons for switching views.
- **Parent:** `App`
- **Children:** None
- **Responsibilities:**
  - Renders filter buttons: `All`, `Pending`, `Completed`.
  - Highlights the currently active filter button with an active style.
  - Emits filter changes to the parent via `onFilterChange`.
- **Props:**
  ```typescript
  export type FilterType = 'all' | 'pending' | 'completed';

  interface TaskFiltersProps {
    currentFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
  }
  ```

---

### 6. `TaskList` (`src/components/TaskList.tsx`)
- **Role:** Container for rendering the list of tasks or displaying loading/error/empty feedback.
- **Parent:** `App`
- **Children:** `TaskItem`, `EmptyState`
- **Responsibilities:**
  - Handles conditional rendering:
    - If `loading === true`: renders a loading message/spinner.
    - If `error !== null`: renders an error message.
    - If `tasks.length === 0`: renders `<EmptyState />` with a relevant message based on `currentFilter`.
    - If `tasks.length > 0`: maps over `tasks` and renders `<TaskItem />` for each task using `task.id` as the unique `key`.
- **Props:**
  ```typescript
  interface TaskListProps {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    currentFilter: FilterType;
    onToggleTask: (id: number) => void;
    onDeleteTask: (id: number) => void;
  }
  ```

---

### 7. `TaskItem` (`src/components/TaskItem.tsx`)
- **Role:** Reusable row/card representing a single task item.
- **Parent:** `TaskList`
- **Children:** None
- **Responsibilities:**
  - Displays task title (with completed visual styling like strikethrough / muted color).
  - Displays status badge (`Completed` / `Pending`).
  - Provides a completion toggle checkbox/button (`onChange` or `onClick`).
  - Provides a delete button with a click handler.
- **Props:**
  ```typescript
  interface TaskItemProps {
    task: Task;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
  }
  ```

---

### 8. `EmptyState` (`src/components/EmptyState.tsx`)
- **Role:** Reusable fallback banner when a list or filtered subset is empty.
- **Parent:** `TaskList`
- **Children:** None
- **Responsibilities:**
  - Displays context-aware empty feedback (e.g., "No tasks found.", "No completed tasks yet.", "No pending tasks!").
- **Props:**
  ```typescript
  interface EmptyStateProps {
    filter: FilterType;
  }
  ```

---

## 3. TypeScript Data Contracts (`src/types/task.ts`)

```typescript
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
```

---

## 4. State Management & Data Flow Justification

| State | Location | Why It Lives There |
| :--- | :--- | :--- |
| `tasks` (`Task[]`) | `App` | Shared between `TaskSummary` (metrics), `AddTaskForm` (adding), and `TaskList` (displaying/toggling/deleting). |
| `filter` (`FilterType`) | `App` | Controls which tasks `TaskList` displays and which filter button `TaskFilters` highlights. |
| `loading` (`boolean`) | `App` | Determined by the initial API request in `App`'s `useEffect`, controlling global loading display. |
| `error` (`string \| null`) | `App` | Captures network/fetch errors during initial load to display error notifications. |
| `title` (`string`) | `AddTaskForm` | Isolated form input state; no other component needs to know what the user is typing before submission. |

### Derived State (Computed on-the-fly, not in `useState`):
- **`totalCount`**: `tasks.length`
- **`completedCount`**: `tasks.filter(t => t.completed).length`
- **`remainingCount`**: `tasks.filter(t => !t.completed).length`
- **`filteredTasks`**: `tasks.filter(t => ...)` based on `filter` value.

---

## 5. Summary Checklist Before Implementation
- [x] Clear component boundaries defined.
- [x] Single responsibility principle followed for each component.
- [x] Props and callback functions clearly typed.
- [x] State lifting applied properly to avoid prop drilling and unnecessary state duplication.
- [x] Derived state used instead of redundant state variables.
- [x] Prompt saved for assignment submission requirements.
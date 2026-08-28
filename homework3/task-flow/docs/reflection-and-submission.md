# TaskFlow - Homework Submission & Reflection

## 1. Architecture & Component Hierarchy Diagram

```text
App (src/App.tsx - Clean Orchestrator)
│
├── Custom Hooks & Services Layer
│   ├── useTaskManager (src/hooks/useTaskManager.ts - State, CRUD & Storage Sync)
│   ├── useTaskFilters (src/hooks/useTaskFilters.ts - Filter & Memoized Computations)
│   ├── useTheme (src/hooks/useTheme.ts - Theme State & DOM Class Sync)
│   ├── taskApi (src/api/taskApi.ts - DummyJSON API Fetching & Mapping)
│   ├── storage (src/utils/storage.ts - Type-Safe LocalStorage Wrapper)
│   ├── dateUtils (src/utils/dateUtils.ts - Unified Timestamp Formatter)
│   └── taskConfig (src/constants/taskConfig.ts - Single Source of Truth for Configs)
│
├── Header (src/components/Header.tsx - Brand, Tagline & API Reset Action)
│   └── ThemeToggle (src/components/ThemeToggle.tsx - Light/Dark Switcher Button)
│
├── TaskSummary (src/components/TaskSummary.tsx - Total, Completed, Remaining Metric Cards)
│
├── AddTaskForm (src/components/AddTaskForm.tsx - Title Input, Priority Dropdown & Validation)
│
├── TaskFilters (src/components/TaskFilters.tsx - Status Tabs & Priority Filter Pills)
│
└── TaskList (src/components/TaskList.tsx - Container for Lists, Skeletons, Errors & Empty States)
    │
    ├── TaskSkeleton (src/components/TaskSkeleton.tsx - Loading Skeleton Cards)
    │
    ├── TaskItem [React.memo] (src/components/TaskItem.tsx - Checkbox, Inline Edit, Priority Badge, Date, Delete)
    │
    └── EmptyState (src/components/EmptyState.tsx - Context-Aware Empty State Feedback)
```

---

## 2. The Three AI Prompts Used During Development

### Stage 1: Component Planning (Task 1)
> **Prompt:**  
> *"Analyze this Task Manager interface and suggest a React component hierarchy. Explain each component's responsibility, parent-child relationships, reusable elements, and required props. Do not write the implementation code."*

### Stage 2: Implementation Review (Task 2)
> **Prompt:**  
> *"Review this React + TypeScript Task Manager implementation across the following areas: component responsibilities, props usage, state location, state mutations, repeated code, TypeScript typing, useEffect, list keys, unnecessary re-renders, and maintainability. Identify any potential issues or anti-patterns and explain why they are problems. Do not rewrite the entire application."*

### Stage 3: Testing & Debugging (Task 3)
> **Prompt:**  
> *"Review the test scenarios for our React Task Manager application across all functional and edge-case requirements (adding tasks, whitespace validation, toggling completion, inline editing, deletion, priority filters, status filters, summary updates, API loading/error states, localStorage persistence, and responsive layout). Explain any potential root causes for edge-case bugs and how our architecture prevents them."*

---

## 3. Engineering Reflection Questions

### Q1: What did AI help me with?
**Answer:**
- **Architecture & Component Decomposition:** AI helped organize the UI into discrete, single-responsibility components (`Header`, `ThemeToggle`, `TaskSummary`, `AddTaskForm`, `TaskFilters`, `TaskList`, `TaskItem`, `TaskSkeleton`, `EmptyState`) before code was written.
- **Design System Tokens & Physics:** AI structured the **Neobrutalism design system** (inspired by `neobrutalism.dev`), configuring hard drop shadows (`4px 4px 0px #000`), tactile mechanical button physics (`translate(2px, 2px)` on hover / `translate(4px, 4px)` on active click), high-contrast borders (`2.5px solid #000`), and dark mode CSS tokens.
- **Bonus Capabilities Implementation:** AI helped design the inline editing flow (`handleEditTask`), priority selection system (`low`, `medium`, `high`), formatted timestamps (`createdAt`), `localStorage` automatic synchronization, and skeleton loading animation.

---

### Q2: What did I have to understand and verify myself?
**Answer:**
- **React State Immutability:** I verified that arrays and objects were never mutated directly. Every update (`setTasks`) creates a new array reference using `.map()` for toggling and editing, `.filter()` for deleting, and spread operator `[newTask, ...prev]` for adding.
- **Derived State vs. Stored State:** I verified that summary metrics (total, completed, remaining) and filtered tasks (by status, priority, and search query) are derived on the fly during render via `useMemo` rather than stored in separate `useState` hooks, preventing synchronization lag and unnecessary re-renders.
- **State Colocation & Performance:** I verified how `AddTaskForm` isolates input text and priority selection in local state to prevent app-wide re-renders on keystrokes, and how wrapping `TaskItem` in `React.memo` paired with `useCallback` eliminates cascading re-renders when a single task changes.
- **LocalStorage & API Fallback Cycle:** I verified that tasks initialize from `localStorage` on repeat visits, correctly handle empty task lists (`[]`), fall back to `https://dummyjson.com/todos` on first visit (`null`), and can be cleanly restored anytime via the "Reset API" button.

---

### Q3: Which AI suggestion did I reject or modify, and why?
**Answer:**
- **Rejected Redundant Filtering States via `useEffect`:** An early suggestion was to keep separate states for `filteredTasks` and `summaryCounts` and update them with `useEffect`. I **rejected** this because it creates unnecessary re-render cascades and state desynchronization bugs. I replaced it with derived constants calculated directly in render using `useMemo`.
- **Rejected Legacy `React.FC` Typings:** An AI suggestion used `React.FC<Props>`. I **rejected** this because `React.FC` is discouraged in modern React + TypeScript due to type verbosity and awkward handling of generic parameters. I used standard typed function parameters (`export function Component({ ... }: Props)`).
- **Rejected `transition: all` in CSS:** An early suggestion animated all CSS properties uniformly. I **rejected** this because `transition: all` triggers CPU-heavy layout recalculations. I constrained transitions to GPU-composited properties (`transform`, `opacity`, `box-shadow`, `background-color`).
- **Modified ID Generation:** A suggestion was to use `tasks.length + 1` for new task IDs. I **modified** this to `Date.now()` because deletions would cause `tasks.length + 1` to collide with existing IDs, causing duplicate key warnings and broken checkbox toggling in React's reconciliation engine.
- **Modified Storage Loading Condition (Bug Fix):** An early suggestion checked `if (saved && saved.length > 0)`. When a user cleared all tasks, `saved` was `"[]"`, causing `loading` to stay `true` forever. I **modified** it to check `saved !== null` to distinguish between an intentional empty list (`[]`) and a first-time visitor (`null`).
- **Enhanced Neobrutalist Skeleton:** Instead of a generic spinning icon, I created `<TaskSkeleton />` with chunky brutalist cards matching the layout of actual task cards for better visual continuity.

---

### Q4: How did I decide where state should live?
**Answer:**
- **`tasks` State:** Lives in `useTaskManager` (consumed by `App.tsx`) because `TaskSummary`, `AddTaskForm`, `TaskFilters`, and `TaskList` all need access to read or mutate the task list.
- **`filter`, `priorityFilter` & `searchQuery` States:** Live in `useTaskFilters` (consumed by `App.tsx`) because `TaskFilters` controls them and `TaskList` displays items filtered by both criteria.
- **`theme` State:** Lives in `useTheme` (consumed by `App.tsx`) and syncs with `document.documentElement` (`.dark` class) and `localStorage`.
- **`title`, `priority` & `inputError` Inputs:** Live locally inside `AddTaskForm.tsx` (colocated state) to avoid re-rendering the whole application on every keystroke.
- **`isEditing` & `editTitle`:** Live locally inside `TaskItem.tsx` so that editing one task does not affect or re-render sibling tasks.

---

## 4. Deliverables Checklist

- [x] **1. Complete React project source code** in `src/`
- [x] **2. package.json** configured with React 19, Vite, TypeScript, ESLint 9+
- [x] **3. React + TypeScript source files:**
  - `App.tsx` (Clean orchestrator)
  - `components/Header.tsx`, `components/ThemeToggle.tsx`
  - `components/TaskSummary.tsx`, `components/AddTaskForm.tsx`
  - `components/TaskFilters.tsx`, `components/TaskList.tsx`
  - `components/TaskItem.tsx` (Memoized with `React.memo`)
  - `components/TaskSkeleton.tsx`, `components/EmptyState.tsx`
  - `hooks/useTaskManager.ts`, `hooks/useTaskFilters.ts`, `hooks/useTheme.ts`
  - `api/taskApi.ts`, `constants/taskConfig.ts`
  - `utils/storage.ts`, `utils/dateUtils.ts`
  - `types/task.ts`
- [x] **4. CSS files** (`App.css`, `index.css`) with full Neobrutalism design system, WCAG focus rings, composite transitions, and dark mode
- [x] **5. Component hierarchy diagram** (included above and in `docs/component-planning.md`)
- [x] **6. Three AI prompts documented** (included above and in `docs/`)
- [x] **7. Four reflection questions answered** (included above)
- [x] **8. Comprehensive Bonus Features:**
  - Full Neobrutalism Design System ([neobrutalism.dev](https://www.neobrutalism.dev))
  - Dark / Light mode toggle with persistent preference
  - Task Priority system (`Low`, `Medium`, `High`) with badges and priority filter
  - Inline Task Editing (Save `✓`, Cancel `✕`, `Enter`/`Esc` keys)
  - Standardized Task Creation Timestamps (`Aug 28, 11:15 AM`)
  - LocalStorage persistence with "Reset API" fallback & empty list bug fix
  - Real-time search by title
  - Clear Completed bulk action
  - Neobrutalist Skeleton loading state
  - WCAG 2.1 AA Accessibility enhancements (`.sr-only`, `aria-invalid`, `aria-describedby`, `:focus-visible`)
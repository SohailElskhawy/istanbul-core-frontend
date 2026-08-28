# TaskFlow - Homework Submission & Reflection

## 1. Component Hierarchy Diagram

```text
App (src/App.tsx)
│
├── Header (src/components/Header.tsx)
│   └── ThemeToggle (src/components/ThemeToggle.tsx)
│
├── TaskSummary (src/components/TaskSummary.tsx)
│
├── AddTaskForm (src/components/AddTaskForm.tsx)
│
├── TaskFilters (src/components/TaskFilters.tsx)
│
└── TaskList (src/components/TaskList.tsx)
    │
    ├── TaskSkeleton (src/components/TaskSkeleton.tsx)
    │
    ├── TaskItem (src/components/TaskItem.tsx)
    │
    └── EmptyState (src/components/EmptyState.tsx)
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
- **Derived State vs. Stored State:** I verified that summary metrics (total, completed, remaining) and filtered tasks (by status, priority, and search query) are derived on the fly during render rather than stored in separate `useState` hooks, preventing synchronization lag and unnecessary re-renders.
- **Controlled Components & Forms:** I verified how `AddTaskForm` isolates input text and priority selection in local state, validating non-empty input before passing it up to `App`.
- **LocalStorage & API Fallback Cycle:** I verified that tasks initialize from `localStorage` on repeat visits, fall back to `https://dummyjson.com/todos` on first visit, and can be cleanly restored anytime via the "Reset API" button.

---

### Q3: Which AI suggestion did I reject or modify, and why?
**Answer:**
- **Rejected Redundant Filtering States:** An early suggestion was to keep separate states for `filteredTasks` and `summaryCounts` and update them with `useEffect`. I **rejected** this because it creates unnecessary re-render cascades and state desynchronization bugs. I replaced it with derived constants calculated directly in render.
- **Modified ID Generation:** A suggestion was to use `tasks.length + 1` for new task IDs. I **modified** this to `Date.now()` because deletions would cause `tasks.length + 1` to collide with existing IDs, causing duplicate key warnings and broken checkbox toggling in React's reconciliation engine.
- **Enhanced Neobrutalist Skeleton:** Instead of a generic spinning icon, I created `<TaskSkeleton />` with chunky brutalist cards matching the layout of actual task cards for better visual continuity.

---

### Q4: How did I decide where state should live?
**Answer:**
- **`tasks` State:** Lives in `App.tsx` (lifted up) because `TaskSummary`, `AddTaskForm`, `TaskFilters`, and `TaskList` all need access to read or mutate the task list.
- **`filter` & `priorityFilter` States:** Live in `App.tsx` because `TaskFilters` controls them and `TaskList` displays items filtered by both criteria.
- **`searchQuery` State:** Lives in `App.tsx` so the task list can filter dynamically while keeping the search query in sync.
- **`theme` State:** Lives in `App.tsx` and syncs with `document.documentElement` (`.dark` class) and `localStorage`.
- **`title` & `priority` Inputs:** Live locally inside `AddTaskForm.tsx` (colocated state) to avoid re-rendering the whole application on every keystroke.
- **`isEditing` & `editTitle`:** Live locally inside `TaskItem.tsx` so that editing one task does not affect or re-render sibling tasks.

---

## 4. Deliverables Checklist

- [x] **1. Complete React project source code** in `src/`
- [x] **2. package.json** configured with React, Vite, TypeScript
- [x] **3. React + TypeScript source files** (`App.tsx`, `Header.tsx`, `ThemeToggle.tsx`, `TaskSummary.tsx`, `AddTaskForm.tsx`, `TaskFilters.tsx`, `TaskList.tsx`, `TaskItem.tsx`, `TaskSkeleton.tsx`, `EmptyState.tsx`, `types/task.ts`)
- [x] **4. CSS files** (`App.css`, `index.css`) with full Neobrutalism design system, dark mode, and responsive layout
- [x] **5. Component hierarchy diagram** (included above and in `docs/component-planning.md`)
- [x] **6. Three AI prompts documented** (included above and in `docs/`)
- [x] **7. Four reflection questions answered** (included above)
- [x] **8. Comprehensive Bonus Features:**
  - Full Neobrutalism Design System ([neobrutalism.dev](https://www.neobrutalism.dev))
  - Dark / Light mode toggle with persistent preference
  - Task Priority system (`Low`, `Medium`, `High`) with badges and priority filter
  - Inline Task Editing (Save `✓`, Cancel `✕`, `Enter`/`Esc` keys)
  - Task Creation Timestamps
  - LocalStorage persistence with "Reset API" fallback
  - Real-time search by title
  - Clear Completed bulk action
  - Neobrutalist Skeleton loading state
# TaskFlow - Homework Submission & Reflection

## 1. Component Hierarchy Diagram

```text
App (src/App.tsx)
│
├── Header (src/components/Header.tsx)
│
├── TaskSummary (src/components/TaskSummary.tsx)
│
├── AddTaskForm (src/components/AddTaskForm.tsx)
│
├── TaskFilters (src/components/TaskFilters.tsx)
│
└── TaskList (src/components/TaskList.tsx)
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
> *"Review the test scenarios for our React Task Manager application across all functional and edge-case requirements (adding tasks, whitespace validation, toggling completion, deletion, filters, summary updates, API loading/error states, and responsive layout). Explain any potential root causes for edge-case bugs and how our architecture prevents them."*

---

## 3. Engineering Reflection Questions

### Q1: What did AI help me with?
**Answer:**
- **Architecture & Component Decomposition:** AI helped organize the UI into discrete, single-responsibility components (`Header`, `TaskSummary`, `AddTaskForm`, `TaskFilters`, `TaskList`, `TaskItem`, `EmptyState`) before any code was written.
- **Edge-Case Brainstorming:** AI highlighted subtle issues such as whitespace validation (`trim()`), ID collision avoidance when combining DummyJSON tasks with user-created tasks, and empty state variations for each active filter.
- **TypeScript Contract Design:** AI assisted in drafting clear interfaces (`Task`, `FilterType`, `DummyJsonTodosResponse`) and strongly-typed props for all components.

---

### Q2: What did I have to understand and verify myself?
**Answer:**
- **React State Immutability:** I had to ensure that arrays and objects were never mutated directly. Every update (`setTasks`) creates a new array reference using `.map()` for toggling, `.filter()` for deleting, and spread operator `[newTask, ...prev]` for adding.
- **Derived State vs. Stored State:** I verified that summary numbers (total, completed, remaining) and filtered tasks are calculated on the fly during render rather than stored in separate `useState` hooks, preventing state-sync bugs.
- **Component Communication via Callback Props:** I verified how actions flow up from child components (e.g. `AddTaskForm` calling `onAddTask`, `TaskItem` calling `onToggle` and `onDelete`) to the parent `App` component.
- **Asynchronous Lifecycle & Error Handling:** I verified how `useEffect` executes the API call on mount and how `loading` and `error` states conditionally swap the UI without crashing.

---

### Q3: Which AI suggestion did I reject or modify, and why?
**Answer:**
- **Rejected Redundant States:** Initial drafts suggested keeping a separate `filteredTasks` state and updating it inside a `useEffect` whenever `tasks` or `filter` changed. I **rejected** this approach because it is a known React anti-pattern (redundant state that causes double renders and synchronization bugs). Instead, I made `filteredTasks` a derived constant computed directly in the render function.
- **Modified ID Generation:** A suggestion was to use `tasks.length + 1` for new IDs. I **modified** this to `Date.now()` because if tasks are deleted, `tasks.length + 1` could easily collide with existing IDs, causing duplicate `key` warnings and buggy re-renders in React's reconciliation engine.
- **Enhanced Empty States:** Instead of a single generic "No tasks found" message, I enhanced `<EmptyState />` to provide contextual guidance based on the active filter (e.g., "No completed tasks yet" vs "No pending tasks! All caught up").

---

### Q4: How did I decide where state should live?
**Answer:**
- **`tasks` State:** Lives in `App.tsx` (lifted up) because `TaskSummary` needs it to calculate metrics, `AddTaskForm` needs to append new items to it, and `TaskList` needs to display, toggle, and delete items from it.
- **`filter` State:** Lives in `App.tsx` because `TaskFilters` needs to show the active button, and `TaskList` needs to filter its displayed items.
- **`loading` & `error` State:** Live in `App.tsx` because the initial API fetch happens at the application root level on mount.
- **`title` (Input Text) State:** Lives locally inside `AddTaskForm.tsx` (colocated state) because no other component needs to know what the user is typing in real time. Isolating it prevents the entire app and task list from re-rendering on every keystroke.

---

## 4. Deliverables Checklist

- [x] **1. Complete React project source code** in `src/`
- [x] **2. package.json** configured with React, Vite, TypeScript
- [x] **3. React + TypeScript source files** (`App.tsx`, `Header.tsx`, `TaskSummary.tsx`, `AddTaskForm.tsx`, `TaskFilters.tsx`, `TaskList.tsx`, `TaskItem.tsx`, `EmptyState.tsx`, `types/task.ts`)
- [x] **4. CSS files** (`App.css`, `index.css`) with responsive styling for Desktop, Tablet, and Mobile
- [x] **5. Component hierarchy diagram** (included above and in `docs/component-planning.md`)
- [x] **6. Three AI prompts documented** (included above and in `docs/`)
- [x] **7. Four reflection questions answered** (included above)
- [x] **8. Bonus Challenges implemented:**
  - Real-time task search by title
  - Clear Completed tasks button
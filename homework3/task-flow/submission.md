# Frontend Practical Assignment: React Task Manager (TaskFlow)
**Student Submission Document**  
**Course:** Frontend Engineering — Session 3  
**Project:** TaskFlow (React + TypeScript + Vite)  
**Design System:** Custom Neobrutalism (inspired by [neobrutalism.dev](https://www.neobrutalism.dev))  

---

## 1. Project Overview & Features

TaskFlow is a production-grade, responsive Task Manager web application built with **React**, **TypeScript**, and **Vite**. It incorporates all required core features, architectural best practices (SOLID, Clean Code, DRY, immutability), and an extensive suite of bonus capabilities styled with a bold Neobrutalism design system.

### Key Capabilities:
- **Modular Component Architecture:** 10 discrete, single-responsibility components with strict prop contracts.
- **Dynamic Task Summary:** Real-time counters for Total, Completed, and Remaining tasks.
- **Add Tasks with Priority & Validation:** Input validation (`trim()`) preventing empty submissions + Priority selection (`Low`, `Medium`, `High`).
- **Inline Task Editing (Bonus):** Edit task titles in-place with `Save` (`✓`), `Cancel` (`✕`), and keyboard shortcuts (`Enter` / `Escape`).
- **Task Creation Timestamps (Bonus):** Formatted timestamps displayed on each task card.
- **Toggle & Delete Tasks:** Immediate UI updates powered by immutable array updates (`.map()` and `.filter()`).
- **Multi-Filter System:** Filter tasks by status (`All`, `Pending`, `Completed`) and priority level (`All`, `High`, `Medium`, `Low`).
- **Real-Time Search (Bonus):** Instant keyword search by title with a clear query button.
- **LocalStorage Persistence & API Reset (Bonus):** Auto-saves tasks to `localStorage` with a dedicated "Reset API" action to reload from DummyJSON.
- **Dark / Light Mode Theme Switcher (Bonus):** Complete dark mode support with persistent user preferences.
- **Neobrutalist Skeleton Loading (Bonus):** Animated chunky brutalist skeleton placeholders during fetch.
- **Clear Completed Bulk Action (Bonus):** Wipes all finished tasks at once.

---

## 2. Component Hierarchy Diagram

```text
App (src/App.tsx - Global State Owner & Theme Coordinator)
│
├── Header (src/components/Header.tsx - Brand, Subtitle, API Reset)
│   └── ThemeToggle (src/components/ThemeToggle.tsx - Dark/Light Switcher)
│
├── TaskSummary (src/components/TaskSummary.tsx - Total, Completed, Remaining Cards)
│
├── AddTaskForm (src/components/AddTaskForm.tsx - Title Input, Priority Dropdown, Validation)
│
├── TaskFilters (src/components/TaskFilters.tsx - Status Tabs & Priority Filter Pills)
│
└── TaskList (src/components/TaskList.tsx - Container for Lists, Skeletons, Errors & Empty States)
    │
    ├── TaskSkeleton (src/components/TaskSkeleton.tsx - Loading Skeleton Cards)
    │
    ├── TaskItem (src/components/TaskItem.tsx - Checkbox, Inline Edit, Priority Badge, Date, Delete)
    │
    └── EmptyState (src/components/EmptyState.tsx - Context-Aware Empty State Feedback)
```

---

## 3. The Three AI Prompts Used During Development

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

## 4. Engineering Reflection

### Q1: What did AI help me with?
- **Architecture & Component Decomposition:** AI assisted in decomposing the interface into discrete, single-responsibility components before writing any code.
- **Design System Tokens & Physics:** AI structured the custom **Neobrutalism design system** (inspired by `neobrutalism.dev`), configuring hard zero-blur offset drop shadows (`4px 4px 0px #000`), tactile mechanical button physics (`translate(2px, 2px)` on hover and `translate(4px, 4px)` on click), high-contrast borders (`2.5px solid #000`), and dark mode CSS variables.
- **Bonus Capabilities Implementation:** AI helped design the inline editing flow (`handleEditTask`), priority selection system (`low`, `medium`, `high`), formatted timestamps (`createdAt`), `localStorage` automatic synchronization, and skeleton loading animation.

---

### Q2: What did I have to understand and verify myself?
- **React State Immutability:** I verified that arrays and objects were never mutated directly. Every update (`setTasks`) creates a new array reference using `.map()` for toggling and editing, `.filter()` for deleting, and spread operator `[newTask, ...prev]` for adding.
- **Derived State vs. Stored State:** I verified that summary metrics (total, completed, remaining) and filtered tasks (by status, priority, and search query) are derived on the fly during render rather than stored in separate `useState` hooks, preventing synchronization lag and unnecessary re-renders.
- **Controlled Components & Forms:** I verified how `AddTaskForm` isolates input text and priority selection in local state, validating non-empty input before passing it up to `App`.
- **LocalStorage & API Fallback Cycle:** I verified that tasks initialize from `localStorage` on repeat visits, fall back to `https://dummyjson.com/todos` on first visit, and can be cleanly restored anytime via the "Reset API" button.

---

### Q3: Which AI suggestion did I reject or modify, and why?
- **Rejected Redundant Filtering States:** An early suggestion was to keep separate states for `filteredTasks` and `summaryCounts` and update them with `useEffect`. I **rejected** this because it creates unnecessary re-render cascades and state desynchronization bugs. I replaced it with derived constants calculated directly in render.
- **Modified ID Generation:** A suggestion was to use `tasks.length + 1` for new task IDs. I **modified** this to `Date.now()` because deletions would cause `tasks.length + 1` to collide with existing IDs, causing duplicate key warnings and broken checkbox toggling in React's reconciliation engine.
- **Enhanced Neobrutalist Skeleton:** Instead of a generic spinning icon, I created `<TaskSkeleton />` with chunky brutalist cards matching the layout of actual task cards for better visual continuity.

---

### Q4: How did I decide where state should live?
- **`tasks` State:** Lives in `App.tsx` (lifted up) because `TaskSummary`, `AddTaskForm`, `TaskFilters`, and `TaskList` all need access to read or mutate the task list.
- **`filter` & `priorityFilter` States:** Live in `App.tsx` because `TaskFilters` controls them and `TaskList` displays items filtered by both criteria.
- **`searchQuery` State:** Lives in `App.tsx` so the task list can filter dynamically while keeping the search query in sync.
- **`theme` State:** Lives in `App.tsx` and syncs with `document.documentElement` (`.dark` class) and `localStorage`.
- **`title` & `priority` Inputs:** Live locally inside `AddTaskForm.tsx` (colocated state) to avoid re-rendering the whole application on every keystroke.
- **`isEditing` & `editTitle`:** Live locally inside `TaskItem.tsx` so that editing one task does not affect or re-render sibling tasks.

---

## 5. Deliverables Checklist

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
- [ ] **9. Desktop & Mobile Screenshots** *(Take screenshots from your browser at `http://localhost:5173/`)*

---

## 6. How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Build & Type Check
npm run build
```
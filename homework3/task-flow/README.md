# TaskFlow - Neobrutalism React Task Manager

A production-grade, highly optimized Task Manager web application built with **React 19**, **TypeScript**, and **Vite**, styled with a custom **Neobrutalism Design System** (inspired by [neobrutalism.dev](https://www.neobrutalism.dev)).

---

## 🎨 Design System: Neobrutalism

- **Crisp High-Contrast Borders:** Bold `2.5px` and `3.5px` solid borders (`#000000` in light mode, `#F4F4F5` in dark mode).
- **Hard Drop Shadows:** Distinct zero-blur offset shadows (`4px 4px 0px #000000` / `--shadow-neo`).
- **Tactile Button Physics:** Mechanical button push physics (`translate(2px, 2px)` on hover and `translate(4px, 4px)` on active click).
- **Vibrant Neo Palette:** Cyber Yellow, Bubblegum Pink, Neo Mint Green, Lilac Purple, and Retro Orange.
- **Dark & Light Mode:** Complete dark mode support with system preference detection and `localStorage` persistence.
- **Architectural Background Grid:** High-precision responsive background grid pattern.

---

## 🚀 Key Architectural Highlights & Features

### 🏛️ 1. SOLID & Clean Code Architecture
- **Single Responsibility Principle (SRP):** Business logic, theme management, and filtering are decoupled into dedicated custom hooks (`useTaskManager`, `useTheme`, `useTaskFilters`), keeping [`App.tsx`](file:///C:/Users/sohai/OneDrive/Desktop/work/core-frontend/istanbul-core-frontend/homework3/task-flow/src/App.tsx) under 75 lines.
- **Open/Closed Principle (OCP) & DRY:** Priority metadata and filter options are centralized in [`src/constants/taskConfig.ts`](file:///C:/Users/sohai/OneDrive/Desktop/work/core-frontend/istanbul-core-frontend/homework3/task-flow/src/constants/taskConfig.ts) (`PRIORITY_CONFIG`). Adding new priorities or filters requires no component modifications.
- **Dependency Inversion Principle (DIP):** Network fetching and local storage access are abstracted behind [`src/api/taskApi.ts`](file:///C:/Users/sohai/OneDrive/Desktop/work/core-frontend/istanbul-core-frontend/homework3/task-flow/src/api/taskApi.ts) and [`src/utils/storage.ts`](file:///C:/Users/sohai/OneDrive/Desktop/work/core-frontend/istanbul-core-frontend/homework3/task-flow/src/utils/storage.ts).

### ⚡ 2. React Performance Optimizations
- **Re-render Isolation:** [`TaskItem`](file:///C:/Users/sohai/OneDrive/Desktop/work/core-frontend/istanbul-core-frontend/homework3/task-flow/src/components/TaskItem.tsx) is wrapped in `React.memo` and paired with `useCallback` action handlers to prevent re-rendering unchanged items when a single task updates.
- **Memoized Derivations:** Task statistics and multi-parameter filtering are computed using `useMemo`, eliminating redundant array calculations during theme toggles or unrelated renders.
- **State Colocation:** Form inputs and inline editing states are localized within child components to isolate keystroke re-renders.

### ♿ 3. Accessibility (WCAG 2.1 AA) & HTML Standards
- **Screen Reader Support:** Form inputs and selects use `.sr-only` descriptive `<label>` elements.
- **Accessible Error Announcements:** Validation errors are linked dynamically using `aria-invalid` and `aria-describedby`.
- **Keyboard Navigation:** Custom checkboxes and buttons feature high-contrast `:focus-visible` outline rings for full keyboard operability.

### 🎁 4. Comprehensive Feature Suite
- **Dynamic Task Summary:** Real-time counters for Total, Completed, and Remaining tasks.
- **Task Priority System:** Color-coded priority badges (`Low`, `Medium`, `High`) and priority filtering.
- **Inline Task Editing:** Edit task titles directly in-place with `Save` (`✓`), `Cancel` (`✕`), and keyboard shortcuts (`Enter` / `Escape`).
- **Standardized Timestamps:** Formatted creation timestamps (`Aug 28, 11:15 AM`) on every task card.
- **Real-Time Search:** Instant substring search with clear query button.
- **LocalStorage Persistence with API Reset:** Auto-saves tasks to storage, with a dedicated "Reset API" fallback action to reload fresh DummyJSON data.
- **Chunky Skeleton Loader:** Neobrutalist animated placeholder cards during fetch.
- **Bulk Clear Completed:** Removes all finished tasks in one click.

---

## 📂 Project Structure

```text
task-flow/
├── docs/
│   ├── component-planning.md          # Task 1: Hierarchy, responsibilities & props
│   ├── code-review.md                 # Task 2: Multi-axis implementation review
│   ├── testing-and-debugging.md       # Task 3: Test cases & root cause analysis
│   ├── neobrutalism-and-bonus-plan.md # Design system & bonus roadmap
│   └── reflection-and-submission.md   # Deliverables, prompts & reflection answers
├── src/
│   ├── api/
│   │   └── taskApi.ts                 # Centralized DummyJSON API service & mapping
│   ├── constants/
│   │   └── taskConfig.ts              # Priority configs, filter tabs & storage keys
│   ├── hooks/
│   │   ├── useTaskManager.ts          # Core task CRUD, loading & auto-save hook
│   │   ├── useTaskFilters.ts          # Filtering, search & memoized calculations
│   │   └── useTheme.ts                # Dark/light theme & DOM class sync hook
│   ├── utils/
│   │   ├── storage.ts                 # Type-safe localStorage wrapper & type guards
│   │   └── dateUtils.ts               # Standardized timestamp formatting utility
│   ├── components/
│   │   ├── AddTaskForm.tsx            # Accessible form with priority selection
│   │   ├── EmptyState.tsx             # Context-aware empty state feedback
│   │   ├── Header.tsx                 # App header with branding & reset action
│   │   ├── TaskFilters.tsx            # Status tabs & priority filter buttons
│   │   ├── TaskItem.tsx               # Memoized task card with inline edit & delete
│   │   ├── TaskList.tsx               # Task container with skeletons & error states
│   │   ├── TaskSkeleton.tsx           # Neobrutalist skeleton placeholder cards
│   │   ├── TaskSummary.tsx            # Colored statistical metric boxes
│   │   └── ThemeToggle.tsx            # Light/Dark mode switcher button
│   ├── types/
│   │   └── task.ts                    # TypeScript domain interfaces & union types
│   ├── App.css                        # Neobrutalism layout, hard shadows & animations
│   ├── App.tsx                        # Lean orchestrator component
│   ├── index.css                      # Global tokens, dark mode variables & grid canvas
│   └── main.tsx                       # React root mount
├── eslint.config.js                   # Modern ESLint 9+ flat configuration
├── package.json
├── tsconfig.json
└── submission.md                      # Complete assignment submission document
```

---

## 🛠️ Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

### 3. Run linter
```bash
npm run lint
```

### 4. Build for production & type check
```bash
npm run build
```
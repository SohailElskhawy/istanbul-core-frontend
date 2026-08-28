# Neobrutalism Design System & Bonus Features Plan

This document outlines the architectural plan for refactoring **TaskFlow** into a bold **Neobrutalism design system** (inspired by [neobrutalism.dev](https://www.neobrutalism.dev)) and implementing all bonus features.

---

## 1. Neobrutalism Design System Specification

### 1.1 Core Visual Philosophy
Neobrutalism merges retro brutalist aesthetics (raw shapes, thick borders, high contrast) with modern UI usability (smooth interactions, accessible contrast, vibrant colors).

| Element | Specification |
| :--- | :--- |
| **Borders** | Bold `2px` or `3px` solid black (`#000000` in light mode, `#FFFFFF` / `#E4E4E7` in dark mode) |
| **Shadows** | Hard, sharp offset drop shadows with zero blur: `4px 4px 0px 0px #000000` (`--shadow-neo`) |
| **Hover / Active State** | Tactile mechanical push: `transform: translate(2px, 2px); box-shadow: 2px 2px 0px 0px #000;` on hover; `transform: translate(4px, 4px); box-shadow: 0px 0px 0px 0px;` on click |
| **Border Radius** | Chunky rounded corners: `8px` (`--radius-base`) |
| **Background Grid** | Subtle architectural grid pattern: `linear-gradient(to right, #00000010 1px, transparent 1px)` (70px grid) |

### 1.2 Color Token Palette

```css
:root {
  /* Canvas & Containers */
  --bg-canvas: #f4f0ea;           /* Off-white retro brutalist canvas */
  --bg-card: #ffffff;             /* Crisp white card surface */
  --bg-secondary: #fffdf5;        /* Warm cream secondary */
  --border: #000000;              /* Pure black high-contrast border */
  --shadow-color: #000000;        /* Hard drop shadow */

  /* Neo Accent Colors */
  --color-main: #facc15;          /* Electric Cyber Yellow (Primary Accent) */
  --color-main-foreground: #000;  /* High contrast dark text */
  --color-accent-pink: #f472b6;   /* Punchy Bubblegum Pink */
  --color-accent-blue: #60a5fa;   /* Vivid Sky Blue */
  --color-accent-green: #4ade80;  /* Retro Mint/Lime Green */
  --color-accent-orange: #fb923c; /* Neon Orange */
  --color-accent-purple: #c084fc; /* Vibrant Lilac */

  /* Semantic Feedback */
  --color-success: #4ade80;       /* Completed green */
  --color-warning: #facc15;       /* Pending yellow */
  --color-danger: #f87171;        /* Delete red / error */

  /* Neobrutalist Hard Shadows */
  --neo-shadow: 4px 4px 0px 0px var(--shadow-color);
  --neo-shadow-lg: 6px 6px 0px 0px var(--shadow-color);
  --neo-shadow-sm: 2px 2px 0px 0px var(--shadow-color);
}

/* Dark Mode Tokens */
.dark {
  --bg-canvas: #121214;
  --bg-card: #1c1c21;
  --bg-secondary: #27272f;
  --border: #f4f4f5;
  --shadow-color: #f4f4f5;
  --text-main: #f4f4f5;
  --text-muted: #a1a1aa;
}
```

---

## 2. Bonus Features Specification

We will implement the following comprehensive set of bonus capabilities:

### Feature 1: LocalStorage Persistence with API Reset
- **Behavior:** Tasks, user additions, edits, and deletions persist in the browser's `localStorage` (`taskflow_tasks_v1`).
- **Initial Load:** If `localStorage` has saved tasks, load them immediately; otherwise, fetch initial todos from `https://dummyjson.com/todos` and store them in `localStorage`.
- **API Reset Button:** A dedicated "Reload from API" button allows users to reset their local storage back to fresh DummyJSON API data anytime.

### Feature 2: Dark / Light Neobrutalist Theme Switcher
- **Behavior:** Interactive theme toggle button in the header (Sun / Moon icon).
- **Persistence:** Remembers user preference in `localStorage` (`taskflow_theme`) and applies `.dark` class to `document.documentElement`.

### Feature 3: Task Priority (Low / Medium / High)
- **Behavior:** Users can select a priority (`low` | `medium` | `high`) when creating a task.
- **Visuals:** Chunky color-coded badges with hard borders:
  - 🟢 **Low:** Pastel Green
  - 🟡 **Medium:** Bright Yellow
  - 🔴 **High:** Neon Red/Coral
- **Filtering:** Filter tasks by priority or status.

### Feature 4: Edit Existing Task (Inline Editing)
- **Behavior:** Each task item has an "Edit" button (`✏️`).
- **Interaction:** Clicking "Edit" swaps the task row into an inline input field with "Save" (`✓`) and "Cancel" (`✕`) buttons, plus keyboard shortcuts (`Enter` to save, `Escape` to cancel).

### Feature 5: Task Creation Timestamp
- **Behavior:** Every task captures its creation date (`createdAt`).
- **Display:** Displays a formatted timestamp (e.g., `"Today, 10:15 AM"` or `"Aug 28"`).

### Feature 6: Real-time Search by Title
- **Behavior:** Interactive search bar with instant substring matching and a clear (`✕`) button.

### Feature 7: Clear Completed Tasks
- **Behavior:** A bulk action button that deletes all completed tasks in one click with a confirmation count badge.

### Feature 8: Neobrutalist Skeleton Loading State
- **Behavior:** While initial data loads, renders 4 chunky brutalist skeleton cards with animated shimmer/pulse instead of a plain spinner.

---

## 3. Updated TypeScript Models (`src/types/task.ts`)

```typescript
export type PriorityLevel = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  todo: string;
  completed: boolean;
  priority: PriorityLevel;
  createdAt: string; // ISO string or formatted date
  userId?: number;
}

export type FilterType = 'all' | 'pending' | 'completed';
export type PriorityFilterType = 'all' | PriorityLevel;
export type ThemeMode = 'light' | 'dark';

export interface DummyJsonTodosResponse {
  todos: Array<{
    id: number;
    todo: string;
    completed: boolean;
    userId?: number;
  }>;
  total: number;
  skip: number;
  limit: number;
}
```

---

## 4. Component Architecture Updates

```text
App (Root Component - State & Theme Manager)
│
├── Header (App Title, Tagline, ThemeToggle, Reset API Button)
│
├── TaskSummary (3 Neobrutal Stat Cards: Total, Completed, Remaining)
│
├── AddTaskForm (Title Input, Priority Selector, Submit Button with neo-shadow)
│
├── TaskFilters (Status Filter Tabs & Priority Filter Dropdown/Tabs)
│
└── TaskList (Container rendering Skeletons, Error Alert, EmptyState, or TaskItems)
    │
    ├── TaskSkeleton (Chunky skeleton cards during loading)
    │
    ├── TaskItem (Card with Checkbox, Title / Inline Edit Input, Priority Badge, Date, Edit & Delete Buttons)
    │
    └── EmptyState (Neobrutal illustration & context message)
```

---

## 5. Implementation Steps Roadmap

1. **Step 1:** Update TypeScript models in `src/types/task.ts` to include `priority`, `createdAt`, `ThemeMode`, and `PriorityFilterType`.
2. **Step 2:** Refactor `src/index.css` and `src/App.css` with full Neobrutalism design tokens, hard box-shadows, grid background, bold typography, tactile click effects, and dark mode overrides.
3. **Step 3:** Implement new components:
   - `src/components/ThemeToggle.tsx` (Light/Dark mode switch)
   - `src/components/TaskSkeleton.tsx` (Loading skeleton cards)
4. **Step 4:** Upgrade existing components:
   - `Header.tsx` (Add ThemeToggle and Reset API button)
   - `TaskSummary.tsx` (Neobrutal stat boxes with distinct vibrant colors)
   - `AddTaskForm.tsx` (Add Priority selector: Low / Medium / High)
   - `TaskItem.tsx` (Add Inline editing with Save/Cancel, priority badge, and timestamp)
   - `TaskFilters.tsx` (Status tabs + Priority filter)
   - `TaskList.tsx` (Integrate skeletons and updated TaskItem actions)
5. **Step 5:** Upgrade `App.tsx` state management:
   - LocalStorage auto-sync with `useEffect`
   - Inline edit handler (`handleEditTask`)
   - Priority filter & title search support
   - Clean API reload handler
6. **Step 6:** Verify build (`npm run build`), test all interactions, and commit cleanly to Git.
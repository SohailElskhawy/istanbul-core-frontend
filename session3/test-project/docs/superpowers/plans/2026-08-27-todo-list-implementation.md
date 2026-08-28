# Todo List App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive shadcn/ui todo dashboard using the existing `TaskManager` component files, with safe `localStorage` persistence.

**Architecture:** `App` owns the canonical task state, selected filter, derived counts, and state transitions. A small storage module validates and serializes persisted tasks. The existing `TaskManager` components remain typed presentational boundaries, while generated shadcn primitives provide accessible controls.

**Tech Stack:** React 19, TypeScript, Vite 8, Tailwind CSS v4, shadcn/ui new-york components, Radix UI primitives, lucide-react, browser `localStorage`.

**Spec:** `docs/superpowers/specs/2026-08-27-todo-list-design.md`

## Global Constraints

- Persist tasks under the exact `localStorage` key `taskmanager.tasks`.
- Use the exact task shape `{ id: string; title: string; completed: boolean; createdAt: number }`.
- Keep the first version single-screen and exclude editing, due dates, categories, drag-and-drop, backend sync, and authentication.
- Keep the existing `GlobeStudy` mount with `className="globe-study-section"` and its accessible label.
- Use semantic, keyboard-accessible shadcn controls and accessible names for icon-only buttons.
- Verify with `npm run lint`, `npm run build`, and `node integration.test.mjs`.

---

### Task 1: Configure shadcn/ui and Tailwind foundations

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `vite.config.ts`
- Modify: `tsconfig.json`
- Modify: `tsconfig.app.json`
- Modify: `src/index.css`
- Create: `components.json`
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/checkbox.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/tabs.tsx`
- Create: `src/components/ui/dropdown-menu.tsx`

**Interfaces:**
- Produces shadcn imports such as `@/components/ui/button` and `@/lib/utils`.

- [ ] **Step 1: Install packages**

Run:

```bash
npm install tailwindcss @tailwindcss/vite lucide-react
```

The shadcn add command below will add its Radix and utility dependencies.

- [ ] **Step 2: Configure Vite, Tailwind, and aliases**

Update `vite.config.ts` with:

```ts
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

Add `baseUrl: "."` and `paths: { "@/*": ["./src/*"] }` to both TypeScript config files.

- [ ] **Step 3: Add shadcn configuration and utility**

Create `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

Create `src/lib/utils.ts`:

```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 4: Generate required primitives**

Run:

```bash
npx shadcn@latest add button input checkbox card badge tabs dropdown-menu
```

Confirm only the seven required primitive files and their dependencies are added.

- [ ] **Step 5: Set the Tailwind CSS entrypoint**

Start `src/index.css` with:

```css
@import "tailwindcss";
```

Retain only theme variables and global reset rules that the todo app needs; remove the Vite starter dark-mode and typography rules.

- [ ] **Step 6: Verify the foundation**

Run `npm run build`. Expected: generated primitives and alias imports compile before feature code is added.

---

### Task 2: Add the task model and safe storage helpers

**Files:**
- Create: `src/lib/tasks.ts`
- Create: `src/lib/task-storage.ts`

**Interfaces:**
- Produces `Task`, `TaskFilter`, `isTask`, `loadTasks`, `saveTasks`, and `createTaskId`.

- [ ] **Step 1: Define shared types and validation**

Create `src/lib/tasks.ts` with:

```ts
export type Task = {
  id: string
  title: string
  completed: boolean
  createdAt: number
}

export type TaskFilter = 'all' | 'active' | 'completed'

export function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false
  const task = value as Record<string, unknown>
  return (
    typeof task.id === 'string' &&
    task.id.length > 0 &&
    typeof task.title === 'string' &&
    task.title.trim().length > 0 &&
    typeof task.completed === 'boolean' &&
    typeof task.createdAt === 'number' &&
    Number.isFinite(task.createdAt)
  )
}
```

- [ ] **Step 2: Implement safe read/write and IDs**

Create `src/lib/task-storage.ts` with the exact key `taskmanager.tasks`. `loadTasks` must catch unavailable storage, parse failures, non-array JSON, and invalid records, returning `[]` safely. `saveTasks` must catch write failures without throwing. `createTaskId` must use `crypto.randomUUID()` when available and a timestamp/random fallback otherwise.

```ts
import type { Task } from './tasks'
import { isTask } from './tasks'

export const TASK_STORAGE_KEY = 'taskmanager.tasks'

export function loadTasks(): Task[] {
  try {
    const stored = window.localStorage.getItem(TASK_STORAGE_KEY)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed.filter(isTask) : []
  } catch {
    return []
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // Keep the in-memory UI usable when storage is unavailable.
  }
}

export function createTaskId(): string {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}
```

- [ ] **Step 3: Run `npm run build`** and fix only model/helper type errors.

---

### Task 3: Implement task creation and row interactions

**Files:**
- Modify: `src/components/TaskManager/TaskForm.tsx`
- Modify: `src/components/TaskManager/TaskItem.tsx`

**Interfaces:**
- `TaskForm({ onAdd }: { onAdd: (title: string) => void })`
- `TaskItem({ task, onToggle, onDelete }: { task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void })`

- [ ] **Step 1: Implement `TaskForm`**

Use local `value` and `error` state. On submit, trim the value; for an empty value set `Please enter a task.`, set `aria-invalid`, render the associated error, and keep focus in the input. For a valid value call `onAdd(trimmedTitle)`, then clear value and error. Compose shadcn `Input` and primary `Button` with a `Plus` icon and visible `Add task` text.

- [ ] **Step 2: Implement `TaskItem`**

Render shadcn `Checkbox` with an accessible label `Mark "{task.title}" as complete`, the title, and a `Button variant="ghost" size="icon"` containing `Trash2` plus visually hidden text `Delete "{task.title}"`. Completed rows get line-through/reduced emphasis, while text and checkbox state remain readable.

- [ ] **Step 3: Run `npm run lint` and `npm run build`**. Expected: no unused imports or invalid shadcn prop types.

---

### Task 4: Implement header, filtering, and empty states

**Files:**
- Modify: `src/components/TaskManager/Header.tsx`
- Modify: `src/components/TaskManager/TaskList.tsx`
- Modify: `src/components/TaskManager/EmptyState.tsx`

**Interfaces:**
- `Header({ total, active, completed, onClearCompleted }: { total: number; active: number; completed: number; onClearCompleted: () => void })`
- `EmptyState({ filter }: { filter: TaskFilter })`
- `TaskList({ tasks, filter, onFilterChange, onToggle, onDelete }: { tasks: Task[]; filter: TaskFilter; onFilterChange: (filter: TaskFilter) => void; onToggle: (id: string) => void; onDelete: (id: string) => void })`

- [ ] **Step 1: Implement `Header`**

Render app name `Taskmanager`, supporting copy `A clear space for everything you want to get done.`, three summary `Badge` components, and a `DropdownMenu` with a `MoreHorizontal` trigger. Disable its Clear completed item when `completed === 0`; otherwise call `onClearCompleted`.

- [ ] **Step 2: Implement `EmptyState`**

Use this exact copy map and an `aria-live="polite"` wrapper:

```ts
const emptyCopy = {
  all: ['No tasks yet', 'Add your first task to get started.'],
  active: ['Nothing active', 'All of your tasks are complete.'],
  completed: ['No completed tasks', 'Completed tasks will appear here.'],
} as const
```

- [ ] **Step 3: Implement `TaskList`**

Derive visible tasks from `tasks` and `filter`. Render controlled shadcn `Tabs`, `TabsList`, and `TabsTrigger` for All, Active, and Completed with counts. Render rows in `TabsContent`; use `EmptyState` when the selected tab has no rows. Pass the typed callbacks through to `TaskItem`.

- [ ] **Step 4: Run `npm run lint` and `npm run build`**. Expected: all five TaskManager files are implemented and compile.

---

### Task 5: Compose the app, persist state, and style responsively

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.css`
- Modify: `src/index.css`

**Interfaces:**
- Consumes `loadTasks`, `saveTasks`, `createTaskId`, `Task`, `TaskFilter`, and all five TaskManager components.
- Produces the complete todo screen plus the unchanged `GlobeStudy` integration mount.

- [ ] **Step 1: Replace the Vite starter in `App.tsx`**

Use:

```tsx
const [tasks, setTasks] = useState<Task[]>(loadTasks)
const [filter, setFilter] = useState<TaskFilter>('all')

useEffect(() => {
  saveTasks(tasks)
}, [tasks])
```

Implement functional updates for add (trimmed title, active task, `createTaskId`, `Date.now()`, prepend), toggle (invert matching task), delete (filter by ID), and clear-completed (filter out completed tasks). Derive counts from `tasks`. Compose Header, a Card containing TaskForm, and TaskList in a semantic `main`.

Preserve this exact existing contract below the workspace:

```tsx
<section className="globe-study-section" aria-label="Interactive globe study">
  <GlobeStudy />
</section>
```

- [ ] **Step 2: Replace starter CSS**

Use shadcn theme variables for page foreground/background, surfaces, borders, muted text, and the accent. Style a centered responsive dashboard, header, card, form row, tabs, task separators, completed state, and visible focus rings. At a mobile breakpoint stack form controls, make tabs full-width, and prevent horizontal scrolling. Keep `.globe-study-section` compatible with the existing dark GlobeStudy study.

Remove starter selectors `#center`, `#next-steps`, `#spacer`, `.ticks`, and starter heading/code styles; make `#root` full width with a global `box-sizing` reset.

- [ ] **Step 3: Run complete automated verification**

```bash
npm run lint
npm run build
node integration.test.mjs
```

Expected: all pass, including the existing GlobeStudy source/render contract.

- [ ] **Step 4: Manually verify the user flow**

Verify blank first load, whitespace validation, add/prepend/clear, completion toggle, delete, all three filters and contextual empty states, disabled/enabled Clear completed, refresh persistence, keyboard labels/focus, and a narrow viewport with no horizontal scrolling.

- [ ] **Step 5: Review the final diff**

```bash
git diff --check
git status --short
```

Confirm changes are limited to the todo app, shadcn setup, docs, and required lockfile updates. Do not remove unrelated user work.

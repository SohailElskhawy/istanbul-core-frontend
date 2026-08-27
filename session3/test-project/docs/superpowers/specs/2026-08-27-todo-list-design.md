# Todo List App Design

**Date:** 2026-08-27

**Status:** Approved for planning

## Goal

Turn the existing React/Vite shell and `TaskManager` component placeholders into a polished, responsive todo list app that persists tasks in `localStorage` and uses shadcn/ui primitives for its controls.

## Scope

The first version is a single-screen task dashboard. Users can add a task, mark it complete or active, delete it, filter the list by status, clear completed tasks, and refresh the page without losing tasks.

The first version intentionally excludes task editing, due dates, categories, drag-and-drop ordering, backend synchronization, and authentication.

## Architecture

`App` owns the task collection and all state transitions. It initializes the collection from a dedicated `localStorage` key using a lazy state initializer, validates stored records before using them, and serializes the latest collection after updates.

The existing `src/components/TaskManager` files remain the feature boundary:

- `Header` renders the product identity, counts, and the clear-completed action.
- `TaskForm` renders a controlled title field and calls `onAdd` with a trimmed title.
- `TaskList` renders the active filter controls and the matching task collection.
- `TaskItem` renders one task, its completion control, and its delete action.
- `EmptyState` renders an appropriate message when the current filter has no results.

Components are presentational and communicate with `App` through typed props and callbacks. Filtered tasks and counts are derived from the canonical `tasks` state; no duplicate task collections are maintained.

## Data Model and Persistence

```ts
type Task = {
  id: string
  title: string
  completed: boolean
  createdAt: number
}
```

The storage key is `taskmanager.tasks`. On initialization, the app reads the key, parses JSON, confirms the value is an array, and retains only records with a non-empty string `id`, a string `title`, a boolean `completed`, and a numeric `createdAt`. Any read, parse, or write failure falls back safely without interrupting the UI.

New IDs use `crypto.randomUUID()` when available, with a timestamp/random fallback for environments that do not provide it. New tasks are inserted at the beginning of the list so the most recently added task is visible first.

## User Experience

The page presents a focused task workspace with:

1. A header containing the app name, a short supporting message, task counts, and a secondary menu for clearing completed tasks.
2. A card containing the add-task form.
3. A task list with All, Active, and Completed tabs.
4. Individual task rows with a checkbox, readable title, completion styling, and an icon button to delete.
5. A contextual empty state for an empty list or an empty filtered view.

The layout uses a neutral shadcn base with one accent color, responsive spacing, and high-contrast completed states. It must remain usable on narrow screens without horizontal scrolling.

The existing `GlobeStudy` mount remains below the task workspace with its current `globe-study-section` class and accessible label. It is kept isolated from task state so the todo flow replaces the starter content without breaking the existing integration contract.

## UI Components

Configure shadcn/ui for Vite/Tailwind according to the current Vite setup. Use these primitives:

- `Card` and related card subcomponents for the workspace surface.
- `Input` and `Button` for task creation and actions.
- `Checkbox` for task completion.
- `Badge` for counts and status summaries.
- `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent` for status filtering.
- `DropdownMenu` for the clear-completed action.
- `lucide-react` icons for add, delete, completion, and menu affordances.

Icon-only controls must have an accessible name. Form labels and descriptions must be associated with their controls. Native keyboard behavior from shadcn primitives must be preserved.

## State Transitions

- `addTask(title)`: trim the title, ignore empty values, create an active task, prepend it, and clear the form.
- `toggleTask(id)`: invert `completed` for the matching task.
- `deleteTask(id)`: remove the matching task.
- `clearCompleted()`: remove every task where `completed` is true.
- `setFilter(filter)`: update the selected view without changing the task collection.

The selected filter is UI state only and does not need persistence.

## Error Handling and Accessibility

Malformed storage data must not crash rendering. A blank task submission should show a concise validation message and keep focus in the input. Controls must use semantic buttons, inputs, checkboxes, and tabs, with visible focus states and labels for icon-only buttons. Completed tasks should communicate state through both the checkbox and visual text treatment, not color alone.

## Verification

Run the existing project checks after implementation:

- `npm run lint`
- `npm run build`
- `node integration.test.mjs`

Manually verify add, blank-submit validation, completion toggle, deletion, each filter, clear-completed, narrow-screen layout, and persistence after a refresh. The existing globe study integration contract must remain intact while the default Vite starter content is replaced by the todo app.

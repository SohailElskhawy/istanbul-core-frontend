# Task Manager MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the existing todo starter into the complete single-screen Task Manager MVP defined in `prd.md`.

**Architecture:** A versioned domain model and pure task/progress helpers power a React state controller in `App`. Focused task, progress, and feedback components use shadcn/Radix primitives; localStorage stores one validated application-state envelope. Native sharing uses Web Share with a clipboard fallback.

**Tech Stack:** React 19, TypeScript 6, Vite 8, shadcn/ui patterns, Radix UI, Tailwind CSS 4, lucide-react, Sonner.

**Spec:** `prd.md`

## Global Constraints

- Implement all FR-1 through FR-16 from `prd.md` in a simple single-screen responsive MVP.
- Required task fields are title, start date, and end date; end date cannot precede start date.
- Status is derived as Scheduled, Active, or Completed; the Active filter includes Scheduled tasks.
- Completion awards 10 XP only once per task; each 100 XP advances one level.
- Persist a validated, versioned state envelope locally without accounts or a backend.
- Sharing sends only title, date range, and status through native share or clipboard fallback.
- Use accessible shadcn-style controls, visible focus, high contrast, and mobile-friendly targets.
- Automated test creation and test-suite runs are omitted at the user's explicit request; verify with lint and production build only.

---

### Task 1: Domain model, storage, dates, rewards, and sharing

**Files:** Modify `src/lib/tasks.ts`, `src/lib/task-storage.ts`; create `src/lib/task-engine.ts`, `src/lib/share-task.ts`.

**Interfaces:** Produce `AppState`, task validation/status/filter/sort operations, idempotent completion rewards, progress calculations, safe versioned persistence, and `shareTask(task)`.

- [ ] Expand the task and progress models with all PRD fields.
- [ ] Add pure helpers for validation, status, filtering, ordering, CRUD transitions, progress, XP, levels, achievements, and streaks.
- [ ] Add safe legacy migration and versioned local persistence.
- [ ] Add Web Share with clipboard fallback and safe formatted text.

### Task 2: shadcn foundations and reusable UI primitives

**Files:** Modify package/config/theme files; create focused primitives under `src/components/ui/`.

**Interfaces:** Produce Button, Input, Checkbox, Badge, Progress, Dialog/AlertDialog, DropdownMenu, Tabs, and Toast primitives usable by feature components.

- [ ] Install and configure Tailwind, Radix, lucide, utility, and Sonner dependencies.
- [ ] Configure aliases and the shadcn component manifest.
- [ ] Add only the UI primitives required by the MVP.
- [ ] Establish neutral light tokens with an indigo accent and 8px rounding.

### Task 3: Task workflows and feedback UI

**Files:** Modify files under `src/components/TaskManager/`; create editor, toolbar, delete confirmation, and feedback components as needed.

**Interfaces:** Consume typed tasks and callbacks from `App`; produce accessible create/edit/search/filter/complete/share/delete interactions and contextual empty states.

- [ ] Build the title/date task editor with inline validation.
- [ ] Build search plus All/Active/Completed filters.
- [ ] Build task rows with dates, badges, completion, and actions.
- [ ] Build edit and delete dialogs, share feedback, and empty states.

### Task 4: Progress, rewards, app composition, and responsive finish

**Files:** Modify `src/App.tsx`, `src/App.css`, `src/index.css`; modify/create progress components.

**Interfaces:** Compose the complete screen and connect all domain transitions and persistence.

- [ ] Add level, XP, daily completion, streak, counts, and percentage summary.
- [ ] Connect CRUD, completion, search/filter, sharing, achievements, and persistence.
- [ ] Match the approved Stitch minimal desktop/mobile design.
- [ ] Verify `npm run lint`, `npm run build`, and `git diff --check` without running tests.

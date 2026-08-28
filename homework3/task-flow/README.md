# TaskFlow - Neobrutalism React Task Manager

A bold, responsive Task Manager web application built with **React**, **TypeScript**, **Vite**, and styled with a custom **Neobrutalism Design System** (inspired by [neobrutalism.dev](https://www.neobrutalism.dev)).

---

## 🎨 Design System: Neobrutalism

- **Crisp High-Contrast Borders:** Bold `2.5px` solid borders (`#000000` in light mode, `#F4F4F5` in dark mode).
- **Hard Drop Shadows:** Distinct `4px 4px 0px #000000` offset shadows with zero blur.
- **Tactile Button Physics:** Mechanical button press effect (`translate(2px, 2px)` on hover and `translate(4px, 4px)` on active click).
- **Vibrant Neo Palette:** Cyber Yellow, Bubblegum Pink, Mint Green, Lilac, and Retro Orange.
- **Light & Dark Mode:** Complete dark mode support with persistent user preference.

---

## 🚀 Key Features & Bonus Challenges

- **Component-Driven Architecture:** Clean, modular, and reusable components (`Header`, `ThemeToggle`, `TaskSummary`, `AddTaskForm`, `TaskFilters`, `TaskList`, `TaskItem`, `TaskSkeleton`, `EmptyState`).
- **Dynamic Task Summary:** Real-time statistics tracking Total, Completed, and Remaining tasks.
- **Add Tasks with Priority & Validation:** Input validation (`trim()`) preventing empty submissions and priority selection (`Low`, `Medium`, `High`).
- **Inline Task Editing:** Edit task titles directly in the row with `Save` (`✓`), `Cancel` (`✕`), and keyboard shortcuts (`Enter` / `Esc`).
- **Task Creation Timestamps:** Displays timestamps for when tasks were added.
- **Toggle & Delete Tasks:** Immediate UI updates powered by immutable state management (`map` and `filter`).
- **Dual Filtering (Status & Priority):** Filter by `All`, `Pending`, `Completed` or by priority level (`Low`, `Medium`, `High`).
- **Real-time Search:** Instant keyword search with clear query button.
- **LocalStorage Persistence:** Auto-syncs tasks to `localStorage` with a dedicated "Reset API" button to reload from DummyJSON API.
- **Neobrutalist Skeleton Loading:** Chunky animated brutalist skeleton placeholders during fetch.
- **Clear Completed Bulk Action:** Wipes all finished tasks at once.

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
│   ├── components/
│   │   ├── AddTaskForm.tsx            # Form with title input and priority selector
│   │   ├── EmptyState.tsx             # Contextual empty state feedback
│   │   ├── Header.tsx                 # Header with title, tagline & actions
│   │   ├── TaskFilters.tsx            # Status tabs & priority filter buttons
│   │   ├── TaskItem.tsx               # Task card with inline edit, badges & delete
│   │   ├── TaskList.tsx               # Container with skeletons & error alerts
│   │   ├── TaskSkeleton.tsx           # Neobrutal skeleton loader cards
│   │   ├── TaskSummary.tsx            # Colored statistic cards
│   │   └── ThemeToggle.tsx            # Light/Dark mode switch
│   ├── types/
│   │   └── task.ts                    # TypeScript models & union types
│   ├── App.css                        # Neobrutalism styles, hard shadows & animations
│   ├── App.tsx                        # Root component, state & LocalStorage sync
│   ├── index.css                      # Base tokens, dark mode variables & grid canvas
│   └── main.tsx                       # React root mount
├── package.json
└── tsconfig.json
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

### 3. Build for production & type check
```bash
npm run build
```
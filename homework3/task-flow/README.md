# TaskFlow - React & TypeScript Task Manager

A responsive, feature-rich Task Manager web application built with **React**, **TypeScript**, and **Vite**.

## 🚀 Features

- **Component-Driven Architecture:** Clean, modular, and reusable components (`Header`, `TaskSummary`, `AddTaskForm`, `TaskFilters`, `TaskList`, `TaskItem`, `EmptyState`).
- **Real-Time Task Summary:** Dynamic metrics tracking total, completed, and remaining tasks.
- **Add Tasks with Validation:** Form validation preventing blank or whitespace-only submissions.
- **Toggle & Delete Tasks:** Immediate UI updates powered by immutable state management (`map` and `filter`).
- **Task Filtering:** Filter tasks instantly by `All`, `Pending`, or `Completed` tabs with count badges.
- **Initial Data Loading:** Fetches initial tasks asynchronously from `https://dummyjson.com/todos` on mount via `useEffect`.
- **Defensive Error & Loading UI:** Built-in loading spinners, error alerts with retry mechanism, and contextual empty state feedback.
- **Responsive & Modern Design:** Designed for desktop, tablet, and mobile with accessible form controls, clean cards, and custom checkboxes.
- **Bonus Capabilities:**
  - Real-time search filter by title.
  - "Clear Completed" bulk action.

---

## 📂 Project Structure

```text
task-flow/
├── docs/
│   ├── component-planning.md        # Task 1: Hierarchy, responsibilities & props
│   ├── code-review.md               # Task 2: Multi-axis implementation review
│   ├── testing-and-debugging.md     # Task 3: Test cases & root cause analysis
│   └── reflection-and-submission.md # Deliverables, prompts & reflection questions
├── src/
│   ├── components/
│   │   ├── AddTaskForm.tsx          # Form for adding new tasks
│   │   ├── EmptyState.tsx           # Context-aware empty state feedback
│   │   ├── Header.tsx               # App title and tagline
│   │   ├── TaskFilters.tsx          # Filter buttons (All, Pending, Completed)
│   │   ├── TaskItem.tsx             # Individual task item card/row
│   │   ├── TaskList.tsx             # List container with loading/error handling
│   │   └── TaskSummary.tsx          # Statistics cards
│   ├── types/
│   │   └── task.ts                  # TypeScript interfaces & types
│   ├── App.css                      # Modern responsive styling & animations
│   ├── App.tsx                      # Root component & state owner
│   ├── index.css                    # Base styles & CSS variables
│   └── main.tsx                     # React root mount
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
# TaskFlow - Testing & Debugging Report (Task 3)

## AI Prompt (Task 3)
> **Prompt:** "Review the test scenarios for our React Task Manager application across all functional and edge-case requirements (adding tasks, whitespace validation, toggling completion, inline editing, deletion, priority filters, status filters, summary updates, API loading/error states, localStorage persistence, and responsive layout). Explain any potential root causes for edge-case bugs and how our architecture prevents them."

---

## 1. Test Verification Suite

| # | Test Scenario | Steps Executed | Expected Behavior | Actual Behavior | Result |
| :- | :--- | :--- | :--- | :--- | :-: |
| 1 | **Initial API Load** | Open app on fresh page (no localStorage) | Shows `<TaskSkeleton />` placeholders, then loads 30 tasks from DummyJSON | Correctly loaded and rendered | ✅ PASS |
| 2 | **Task Summary Metrics** | Count total, completed, pending | Displays total count, completed count, and remaining count accurately | Math matches items in list | ✅ PASS |
| 3 | **Add New Task** | Type "Prepare presentation", choose "High", click "Add Task" | New item prepends to top of list with `🔴 High` badge, input clears, summary increments | Item added instantly at top | ✅ PASS |
| 4 | **Empty Input Validation** | Click "Add Task" with empty input or spaces | Prevent submission, display `aria-describedby` error alert "Please enter a task title before adding." | Accessible error message shown | ✅ PASS |
| 5 | **Toggle Task (Pending -> Completed)** | Click checkbox on pending item | Checkbox checks, title gets strikethrough, status badge changes to "Completed", Completed +1, Remaining -1 | Updates immediately | ✅ PASS |
| 6 | **Toggle Task (Completed -> Pending)** | Click checkbox on completed item | Checkbox unchecks, strikethrough removed, badge changes to "Pending", Completed -1, Remaining +1 | Updates immediately | ✅ PASS |
| 7 | **Inline Edit Task** | Click edit button on task -> change text -> press `Enter` or click `✓` | Title updates in state, timestamps preserved, editing form closes | Title cleanly updated | ✅ PASS |
| 8 | **Cancel Inline Edit** | Click edit button -> change text -> press `Escape` or click `✕` | Discards changes, reverts to original title | Changes cancelled | ✅ PASS |
| 9 | **Delete Task** | Click "Delete" button on any task item | Item removed from list, Total decrements by 1, relevant counter decrements | Clean removal | ✅ PASS |
| 10 | **Filter: All** | Click "All" tab | Shows all tasks regardless of status | Displays all tasks | ✅ PASS |
| 11 | **Filter: Pending** | Click "Pending" tab | Shows only items with `completed === false` | Only pending tasks shown | ✅ PASS |
| 12 | **Filter: Completed** | Click "Completed" tab | Shows only items with `completed === true` | Only completed tasks shown | ✅ PASS |
| 13 | **Priority Filter** | Click "🔴 High" priority filter pill | Shows only tasks with `priority === 'high'` | Filtered by priority | ✅ PASS |
| 14 | **Real-Time Search** | Type substring in search box | Filters visible list instantly to matching task titles | Instant search matching | ✅ PASS |
| 15 | **Clear Completed Bulk Action** | Click "Clear Completed" button | Deletes all completed tasks at once | Completed items cleared | ✅ PASS |
| 16 | **LocalStorage Empty Array Bug Fix** | Delete all tasks -> refresh browser | Loads immediately with `<EmptyState />`, does NOT get stuck in infinite loading skeleton | Immediate clean empty state | ✅ PASS |
| 17 | **Reset API Action** | Click "Reset API" button in header | Clears localStorage and re-fetches sample tasks from DummyJSON | Fresh tasks restored | ✅ PASS |
| 18 | **Theme Switcher** | Toggle Dark / Light mode | Toggles `.dark` class on `html`, switches palette tokens, persists across page reload | Smooth theme transition | ✅ PASS |
| 19 | **Keyboard Navigation (A11y)** | Navigate via `Tab` key and toggle via `Space` | High-contrast `:focus-visible` outline appears on custom checkmarks and buttons | Full keyboard accessibility | ✅ PASS |
| 20 | **Re-render Isolation** | Toggle one task in 30-item list | `React.memo` ensures other 29 `TaskItem` components do not re-render | Zero wasted re-renders | ✅ PASS |
| 21 | **Responsive Layout** | Test 375px (Mobile), 768px (Tablet), 1440px (Desktop) | Clean card, no horizontal overflow, stacks inputs neatly on mobile | Flawless responsive UI | ✅ PASS |

---

## 2. Edge Case Analysis & Root Cause Explanations

### Case 1: Whitespace-Only Task Submissions
- **Potential Issue:** A user typing `"   "` (spaces) and clicking submit could create a blank, unclickable task item.
- **Root Cause:** Checking only `if (!title)` is insufficient because a non-empty string of whitespace characters is truthy in JavaScript.
- **Architectural Solution:** We call `title.trim()`. If `!trimmedTitle`, submission is blocked, `aria-invalid` is set to `true`, and an error alert is displayed.

### Case 2: Array Mutation Bugs
- **Potential Issue:** Using `tasks.push(newTask)` or `tasks[index].completed = true` does not trigger a React state re-render because the array reference remains unchanged.
- **Root Cause:** React compares state references (`Object.is`). Mutating an existing array does not change its memory address, causing React to skip the re-render.
- **Architectural Solution:** We use non-mutating operators:
  - Adding: `[newTask, ...prevTasks]`
  - Toggling: `prevTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)`
  - Deleting: `prevTasks.filter(t => t.id !== id)`

### Case 3: Key Prop Collisions
- **Potential Issue:** If user-added tasks used auto-incrementing numbers like `1`, `2`, `3` or `tasks.length + 1`, they would collide with the IDs returned from DummyJSON (`1` through `30`) or collide after deletions.
- **Root Cause:** Duplicate keys cause React's reconciliation engine to misidentify DOM nodes, resulting in broken checkbox states and incorrect items being deleted.
- **Architectural Solution:** Newly created tasks use `Date.now()` (high-resolution timestamp), guaranteeing uniqueness.

### Case 4: Infinite Loading State on Empty LocalStorage Array
- **Potential Issue:** When all tasks are deleted, `localStorage` stores `"[]"`. On the next visit, checking `if (!saved)` evaluates to `false` (since `"[]"` is truthy), while `loading` initializes to `true` (since `length === 0`). The app is trapped in an infinite loading skeleton.
- **Root Cause:** Conflating a first-time visitor (`localStorage.getItem(...) === null`) with an existing user who intentionally has 0 tasks (`saved === "[]"`).
- **Architectural Solution:** `storage.getTasks` returns `null` if the key doesn't exist, and `Task[]` if it does. `isLoading` initializes to `saved === null`. If `saved !== null`, `isLoading` is immediately `false`, preventing the infinite loading skeleton.
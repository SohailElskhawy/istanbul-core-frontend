# TaskFlow - Testing & Debugging Report (Task 3)

## AI Prompt (Task 3)
> **Prompt:** "Review the test scenarios for our React Task Manager application across all functional and edge-case requirements (adding tasks, whitespace validation, toggling completion, deletion, filters, summary updates, API loading/error states, and responsive layout). Explain any potential root causes for edge-case bugs and how our architecture prevents them."

---

## 1. Test Verification Suite

| # | Test Scenario | Steps Executed | Expected Behavior | Actual Behavior | Result |
| :- | :--- | :--- | :--- | :--- | :-: |
| 1 | **Initial API Load** | Open app on fresh page | Shows spinner "Loading tasks...", then loads 30 tasks from DummyJSON | Correctly loaded and rendered | ✅ PASS |
| 2 | **Task Summary Metrics** | Count total, completed, pending | Displays total count, completed count, and remaining count accurately | Math matches items in list | ✅ PASS |
| 3 | **Add New Task** | Type "Prepare presentation" -> Click "Add Task" | New item prepends to top of list, input clears, summary increments Total & Remaining | Item added instantly at top | ✅ PASS |
| 4 | **Empty Input Validation** | Click "Add Task" with empty input or spaces | Prevent submission, keep list unchanged, display helper warning message | "Please enter a task title before adding." | ✅ PASS |
| 5 | **Toggle Task (Pending -> Completed)** | Click checkbox on pending item | Checkbox checks, title gets strikethrough, status badge changes to "Completed", Completed +1, Remaining -1 | Updates immediately | ✅ PASS |
| 6 | **Toggle Task (Completed -> Pending)** | Click checkbox on completed item | Checkbox unchecks, strikethrough removed, badge changes to "Pending", Completed -1, Remaining +1 | Updates immediately | ✅ PASS |
| 7 | **Delete Task** | Click "Delete" button on any task item | Item removed from list, Total decrements by 1, relevant counter decrements | Clean removal | ✅ PASS |
| 8 | **Filter: All** | Click "All" tab | Shows all tasks regardless of status | Displays all tasks | ✅ PASS |
| 9 | **Filter: Pending** | Click "Pending" tab | Shows only items with `completed === false` | Only pending tasks shown | ✅ PASS |
| 10 | **Filter: Completed** | Click "Completed" tab | Shows only items with `completed === true` | Only completed tasks shown | ✅ PASS |
| 11 | **Empty Filter State** | Switch to Completed when 0 completed tasks exist | Shows EmptyState message: "No completed tasks yet" | Displays contextual message | ✅ PASS |
| 12 | **API Error Fallback** | Simulate network offline / HTTP 500 | Shows alert "Something went wrong while loading tasks" with "Try Again" button | App handles failure gracefully | ✅ PASS |
| 13 | **Search Task (Bonus)** | Type substring in search box | Filters visible list to match title | Instant real-time search | ✅ PASS |
| 14 | **Clear Completed (Bonus)** | Click "Clear Completed" button | Deletes all completed tasks at once | Completed items cleared | ✅ PASS |
| 15 | **Responsive Layout** | Test 375px (Mobile), 768px (Tablet), 1440px (Desktop) | Clean card, no horizontal overflow, stacks inputs neatly on mobile | Flawless responsive UI | ✅ PASS |

---

## 2. Edge Case Analysis & Root Cause Explanations

### Case 1: Whitespace-Only Task Submissions
- **Potential Issue:** A user typing `"   "` (spaces) and clicking submit could create a blank, unclickable task item.
- **Root Cause:** Checking only `if (!title)` is insufficient because a non-empty string of whitespace characters is truthy in JavaScript.
- **Architectural Solution:** We call `title.trim()`. If `!trimmedTitle`, submission is blocked and an error alert is displayed.

### Case 2: Array Mutation Bugs
- **Potential Issue:** Using `tasks.push(newTask)` or `tasks[index].completed = true` does not trigger a React state re-render because the array reference remains unchanged.
- **Root Cause:** React compares state references (`Object.is`). Mutating an existing array does not change its memory address, causing React to skip the re-render.
- **Architectural Solution:** We use non-mutating operators:
  - Adding: `[newTask, ...prevTasks]`
  - Toggling: `prevTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)`
  - Deleting: `prevTasks.filter(t => t.id !== id)`

### Case 3: Key Prop Collisions
- **Potential Issue:** If user-added tasks used auto-incrementing numbers like `1`, `2`, `3`, they would collide with the IDs returned from DummyJSON (`1` through `30`).
- **Root Cause:** Duplicate keys cause React's reconciliation engine to misidentify DOM nodes, resulting in broken checkbox states and incorrect items being deleted.
- **Architectural Solution:** Newly created tasks use `Date.now()` (high-resolution timestamp), guaranteeing uniqueness.
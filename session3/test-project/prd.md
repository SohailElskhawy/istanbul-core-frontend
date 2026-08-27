# Product Requirements Document: Task Manager

**Status:** Draft  
**Version:** 1.0  
**Product type:** Responsive web application  
**Primary release:** Minimum Viable Product (MVP)

## 1. Product summary

Task Manager is a fast, simple todo application that helps people capture, organize, track, and complete personal tasks. Every task has a defined start date and end date, a visible status, and a completion control. Lightweight progress tracking and rewards encourage consistent use without making basic task management feel complicated.

The MVP prioritizes a short path from opening the app to adding and completing a task. Advanced planning, collaboration, and competitive gamification are intentionally deferred.

## 2. Problem statement

People need a low-friction way to remember what they need to do, understand what is active or complete, and see whether they are making progress. Many task-management tools add configuration and collaboration features that make simple personal planning feel heavy.

Task Manager should provide the essential workflow in one clear interface:

1. Capture a task.
2. Find and review tasks.
3. Update progress or mark work complete.
4. See progress and receive a small motivational reward.

## 3. Goals

- Make adding, finding, updating, and completing tasks quick and intuitive.
- Give every task a clear time range and status.
- Show progress at a glance through counts and completion percentage.
- Encourage meaningful completion through a lightweight reward system.
- Work well on mobile and desktop without requiring training.
- Preserve a user's tasks between browser sessions.

## 4. Non-goals for the MVP

- Real-time multi-user collaboration.
- Team workspaces, roles, permissions, or approval workflows.
- Comments, file attachments, subtasks, and task dependencies.
- Calendar synchronization or third-party integrations.
- Push notifications and reminders.
- Public or competitive leaderboards.
- Complex reward economies, virtual currencies, or purchasable rewards.
- Native mobile applications.

## 5. Target users

### Primary user

An individual who wants a simple daily task list for personal, study, or lightweight work planning.

### User needs

- Capture a task in seconds.
- Know when work starts and when it is due.
- Distinguish active work from completed work.
- Find a task without manually scanning the entire list.
- Understand daily and overall progress.
- Share the details of a task through another application.

## 6. MVP scope

### 6.1 Task management

**FR-1: Create tasks**

- A user can create a task with a title, start date, and end date.
- The title, start date, and end date are required.
- A blank or whitespace-only title cannot be submitted.
- The end date cannot be earlier than the start date.
- A newly created task defaults to `Active` unless its dates imply a future `Scheduled` state.

**FR-2: View tasks**

- The app displays the user's saved tasks.
- Each task displays its title, start date, end date, status, and completion check mark.
- Tasks use a stable unique identifier so updates apply to the correct task.
- The default ordering places incomplete tasks before completed tasks, then sorts by the nearest end date.

**FR-3: Edit tasks**

- A user can edit a task's title, start date, and end date.
- The same title and date validation used during creation applies during editing.
- Editing a task does not reset its completion state or previously earned reward.

**FR-4: Delete tasks**

- A user can delete a task.
- The app asks for confirmation or provides a short undo action to reduce accidental deletion.
- Deleting a task does not remove reward points that were already earned for completing it.

### 6.2 Status and completion

**FR-5: Task status**

The MVP supports the following statuses:

- `Scheduled`: the start date is in the future and the task is not complete.
- `Active`: the start date has arrived and the task is not complete.
- `Completed`: the user has marked the task complete.

Status is derived from the dates and completion state rather than entered separately. This avoids contradictory combinations such as a checked task labeled Active.

**FR-6: Completion check mark**

- Every task has an accessible check box or equivalent check-mark control.
- Selecting it marks the task as `Completed` and records its completion time.
- Clearing it returns the task to `Scheduled` or `Active`, based on its start date.
- A task only awards completion points once, even if it is reopened and completed again.

### 6.3 Search, filters, and empty states

**FR-7: Search**

- A user can search tasks by title.
- Search is case-insensitive and updates as the user types.
- Search works together with the selected status filter.
- A clear action resets the query.

**FR-8: Filters**

- A user can filter tasks by `All`, `Active`, or `Completed`.
- The `Active` view includes both Scheduled and Active tasks so the primary interface remains simple.
- The selected filter remains visually clear.

**FR-9: Empty states**

- When the user has no tasks, the app explains how to create the first one.
- When search or filtering returns no results, the app explains that no tasks match and offers a way to clear the search or filter.

### 6.4 Progress tracking

**FR-10: Progress summary**

- The app displays total, active, and completed task counts.
- The app displays completion progress as completed tasks divided by total tasks.
- When there are no tasks, progress is shown as 0% rather than being undefined.
- The progress summary updates immediately after task changes.

### 6.5 Simple sharing

**FR-11: Share a task**

- A user can share one task as formatted text containing its title, date range, and status.
- When device-native sharing is available, the app opens the device share sheet.
- Otherwise, the app copies the formatted task details to the clipboard and confirms success.
- Sharing does not grant access to the user's task list and does not create a collaborative task.
- Private local identifiers and reward data are not included in shared content.

### 6.6 Reward system

**FR-12: Completion points**

- Completing a task for the first time awards 10 experience points (XP).
- Reopening and recompleting the same task does not award additional XP.
- Deleting and recreating equivalent tasks should not be promoted as a way to earn points.

**FR-13: Levels**

- The user starts at Level 1.
- Every 100 cumulative XP advances the user by one level.
- The interface shows current level and progress toward the next level.

**FR-14: Achievements**

The MVP includes a small fixed set of achievements:

- **First Step:** Complete the first task.
- **Getting Things Done:** Complete 10 tasks.
- **Momentum:** Complete at least one task on three consecutive calendar days.
- **Task Master:** Complete 50 tasks.

An achievement is awarded only once and produces a brief, dismissible confirmation. Rewards must not interrupt task creation or completion.

**FR-15: Daily progress**

- The app shows how many tasks were completed today.
- A daily completion streak increases when at least one task is completed on consecutive calendar days.
- Missing a day resets the active streak but does not remove XP, levels, or achievements.
- Streak language should encourage returning without shaming the user for a missed day.

### 6.7 Persistence

**FR-16: Local persistence**

- Tasks, completion history, filters, XP, levels, achievements, and streak data persist between sessions on the same browser and device.
- The MVP does not require account registration or sign-in.
- The app handles missing or invalid stored data by returning to a safe initial state without crashing.

## 7. Key user journeys

### Create a task

1. The user opens the task form.
2. The user enters a title, start date, and end date.
3. The app validates the inputs.
4. The user submits the form.
5. The task appears in the list and the totals update.

### Complete a task

1. The user selects the task's check mark.
2. The task changes to Completed.
3. Progress counts and percentage update.
4. If eligible, XP and achievements are awarded once.
5. A lightweight success message confirms the result.

### Find a task

1. The user types into search or selects a filter.
2. The visible list updates immediately.
3. If there are no matches, the app displays a relevant empty state.

### Share a task

1. The user selects Share on a task.
2. The app prepares a plain-text summary.
3. The native share sheet opens when supported; otherwise, the summary is copied.
4. The app confirms that the action succeeded or explains why it failed.

## 8. Information model

### Task

- `id`: unique identifier.
- `title`: required text.
- `startDate`: required date.
- `endDate`: required date equal to or after `startDate`.
- `completed`: Boolean completion value.
- `completedAt`: completion timestamp or null.
- `rewardGranted`: prevents duplicate completion rewards.
- `createdAt`: creation timestamp.
- `updatedAt`: most recent update timestamp.

### User progress

- Total XP.
- Current level, derived from XP.
- Achievement identifiers and award dates.
- Current streak.
- Longest streak.
- Date of the most recent qualifying completion.

## 9. UX requirements

- The primary actions—add, complete, edit, and delete—must be easy to discover.
- The default view should emphasize the task list rather than the reward system.
- Creating a task should require only the three mandatory fields.
- Validation messages should appear next to the relevant field and explain how to fix the problem.
- Destructive actions must be distinguishable from primary actions.
- Keyboard users must be able to operate all controls and see focus clearly.
- Controls must have accessible names; status and progress cannot rely on color alone.
- The layout must remain usable on small mobile screens and desktop displays.
- Success messages and achievement notifications must not block continued use.

## 10. Non-functional requirements

### NFR-1: Performance

- The initial interface should become usable within 2 seconds on a typical mid-range mobile device over a normal 4G connection.
- Search, filtering, and completion updates should respond within 100 milliseconds for up to 1,000 locally stored tasks.
- The app should avoid unnecessary network requests during the core task workflow.

### NFR-2: Simplicity

- A first-time user should be able to create and complete a task without onboarding instructions.
- The MVP should use one primary task-list screen and reveal forms only when needed.
- Optional metadata must not be required to create a task.

### NFR-3: Reliability and data integrity

- Task updates must be persisted immediately after successful user actions.
- Invalid dates, blank titles, and malformed stored records must not crash the app.
- Reward calculations must be idempotent so the same completion event cannot grant duplicate points.

### NFR-4: Accessibility

- All functionality must be usable with a keyboard.
- Form fields must have labels and useful error messages.
- Interactive targets must be large enough for touch use.
- Text and controls must maintain readable contrast.
- Screen readers must be notified of important status changes without excessive announcements.

### NFR-5: Privacy and security

- The MVP stores task data locally and does not transmit it to an application server.
- Shared content must include only the task information shown in the share preview.
- User-entered task text must be rendered as text, not executable markup.

### NFR-6: Compatibility

- Support the latest stable versions of major modern browsers on desktop and mobile.
- The core create, edit, complete, delete, search, and filter flows must still work when native device sharing is unavailable.

## 11. Success metrics

For an MVP pilot, success is measured by:

- At least 80% of test participants can create and complete a task without assistance.
- Median time to create the first task is under 30 seconds.
- At least 95% of valid create, edit, complete, and delete actions persist correctly during testing.
- Search and filtering return the expected results in all acceptance tests.
- No duplicate XP is awarded when a task is reopened and completed again.
- At least 60% of returning pilot users complete a task on more than one day during their first week.

The final engagement target should be refined after collecting baseline pilot data.

## 12. MVP acceptance criteria

The MVP is ready when:

- Users can create, read, edit, and delete valid tasks.
- Every saved task contains a title, start date, and end date.
- Users cannot save blank titles or an end date earlier than the start date.
- Users can mark a task complete and reopen it.
- Status remains consistent with completion and date values.
- Users can search by title and filter by All, Active, or Completed.
- Total, active, completed, and percentage progress values remain accurate.
- Appropriate empty states appear for a new list and for zero search results.
- A task can be shared through the native share sheet or clipboard fallback.
- XP is awarded once per task, levels are calculated correctly, and all four MVP achievements can be unlocked.
- Tasks and reward progress survive a browser refresh and restart on the same device.
- Core workflows are usable by keyboard and on mobile-sized screens.
- Performance targets are verified with a representative set of up to 1,000 tasks.

## 13. Post-MVP opportunities

- Optional task descriptions, priorities, and categories.
- Sorting controls and additional date or status filters.
- Reminders and notifications.
- Calendar views and integrations.
- Accounts and cross-device synchronization.
- Shared links that recipients can import.
- Collaborative lists, assignment, and permissions.
- Custom daily goals and streak freezes.
- Focus timers and time-based challenges.
- Cosmetic themes, avatars, or a virtual garden unlocked by progress.
- Optional friend groups and privacy-conscious leaderboards.
- Data export, import, and backup.

## 14. Assumptions and product decisions

- The MVP is designed for one person using one browser and device.
- Dates use the user's local timezone and are treated as calendar dates rather than precise timestamps.
- `Active` filters include future Scheduled tasks to keep the top-level filter set limited to All, Active, and Completed.
- Sharing means sending or copying task details, not granting access to live task data.
- Editing, search, due dates, and persistence are MVP requirements because they are required by CRUD or the stated functional requirements.
- Priorities and categories remain optional post-MVP features.
- Rewards recognize completion consistency; they do not affect access to essential task-management features.

## 15. Open questions for later validation

- Should the app eventually distinguish `Overdue` as a visible status or only as a visual label on active tasks?
- Should daily streaks use any completed task or only tasks completed by their end date?
- When accounts are introduced, should existing local data be automatically imported after sign-in?
- Should shared task text include a completion state when the task is already complete?

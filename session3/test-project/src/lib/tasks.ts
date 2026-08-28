export type TaskStatus = 'Scheduled' | 'Active' | 'Completed'

export type TaskFilter = 'all' | 'active' | 'completed'

export type Task = {
  id: string
  title: string
  startDate: string
  endDate: string
  completed: boolean
  completedAt: number | null
  rewardGranted: boolean
  createdAt: number
  updatedAt: number
}

export type TaskDraft = {
  title: string
  startDate: string
  endDate: string
}

export type FieldErrors = Partial<Record<keyof TaskDraft, string>>

export function validateDraft(draft: TaskDraft): FieldErrors {
  const errors: FieldErrors = {}

  if (!draft.title || !draft.title.trim()) {
    errors.title = 'Enter a task title.'
  }
  if (!draft.startDate) {
    errors.startDate = 'Choose a start date.'
  }
  if (!draft.endDate) {
    errors.endDate = 'Choose an end date.'
  }
  if (draft.startDate && draft.endDate && draft.endDate < draft.startDate) {
    errors.endDate = 'The end date must be on or after the start date.'
  }

  return errors
}

export type Achievement = {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: number | null
}

export type UserProgress = {
  totalXP: number
  level: number
  currentStreak: number
  longestStreak: number
  lastCompletionDate: string | null
  lifetimeCompletedCount: number
  unlockedAchievements: Record<string, number>
}

export const ACHIEVEMENTS: ReadonlyArray<Omit<Achievement, 'unlockedAt'>> = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Complete your first task',
    icon: '🎯',
  },
  {
    id: 'getting-things-done',
    title: 'Getting Things Done',
    description: 'Complete 10 tasks',
    icon: '🚀',
  },
  {
    id: 'momentum',
    title: 'Momentum',
    description: 'Complete at least one task on 3 consecutive calendar days',
    icon: '🔥',
  },
  {
    id: 'task-master',
    title: 'Task Master',
    description: 'Complete 50 tasks',
    icon: '👑',
  },
]

export function getTodayDateString(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getTaskStatus(task: Task, todayStr: string = getTodayDateString()): TaskStatus {
  if (task.completed) {
    return 'Completed'
  }
  if (task.startDate && task.startDate > todayStr) {
    return 'Scheduled'
  }
  return 'Active'
}

export function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false
  const t = value as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    t.id.length > 0 &&
    typeof t.title === 'string' &&
    t.title.trim().length > 0 &&
    typeof t.completed === 'boolean' &&
    typeof t.startDate === 'string' &&
    typeof t.endDate === 'string' &&
    typeof t.rewardGranted === 'boolean' &&
    typeof t.createdAt === 'number' &&
    typeof t.updatedAt === 'number'
  )
}

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // Incomplete tasks before completed tasks
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    // Then sort by nearest end date
    const dateComparison = a.endDate.localeCompare(b.endDate)
    if (dateComparison !== 0) {
      return dateComparison
    }
    // Then sort by start date
    const startComparison = a.startDate.localeCompare(b.startDate)
    if (startComparison !== 0) {
      return startComparison
    }
    // Then newest first
    return b.createdAt - a.createdAt
  })
}

export function   filterTasks(
  tasks: Task[],
  filter: TaskFilter,
  searchQuery: string = ''
): Task[] {
  const trimmedQuery = searchQuery.trim().toLowerCase()
  return tasks.filter((task) => {
    // Filter by search query
    if (trimmedQuery && !task.title.toLowerCase().includes(trimmedQuery)) {
      return false
    }

    // Filter by status tab:
    // 'all': all tasks
    // 'active': includes both Scheduled and Active (i.e. not completed)
    // 'completed': completed tasks
    if (filter === 'active') {
      return !task.completed
    }
    if (filter === 'completed') {
      return task.completed
    }
    return true
  })
}

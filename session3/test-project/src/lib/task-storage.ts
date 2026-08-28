import {
  type Task,
  type UserProgress,
  getTodayDateString,
} from './tasks'
import { INITIAL_PROGRESS } from './task-engine'

export const TASK_STORAGE_KEY = 'taskmanager.tasks'
export const PROGRESS_STORAGE_KEY = 'taskmanager.progress'

export function createTaskId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Normalizes raw data into valid Task objects, migrating older formats if necessary.
 */
function normalizeTaskRecord(raw: unknown): Task | null {
  if (!raw || typeof raw !== 'object') return null
  const item = raw as Record<string, unknown>

  if (typeof item.id !== 'string' || !item.id) return null
  if (typeof item.title !== 'string' || !item.title.trim()) return null
  const completed = Boolean(item.completed)
  const createdAt = typeof item.createdAt === 'number' && Number.isFinite(item.createdAt) ? item.createdAt : Date.now()
  const updatedAt = typeof item.updatedAt === 'number' && Number.isFinite(item.updatedAt) ? item.updatedAt : createdAt
  const completedAt = typeof item.completedAt === 'number' && Number.isFinite(item.completedAt) ? item.completedAt : (completed ? createdAt : null)
  const rewardGranted = Boolean(item.rewardGranted || completed)

  const todayStr = getTodayDateString(new Date(createdAt))
  const startDate = typeof item.startDate === 'string' && item.startDate ? item.startDate : todayStr
  const endDate = typeof item.endDate === 'string' && item.endDate ? item.endDate : startDate

  const normalized: Task = {
    id: item.id,
    title: item.title.trim(),
    startDate,
    endDate: endDate < startDate ? startDate : endDate,
    completed,
    completedAt,
    rewardGranted,
    createdAt,
    updatedAt,
  }

  return normalized
}

export function loadTasks(): Task[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return []
  }
  try {
    const raw = window.localStorage.getItem(TASK_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map(normalizeTaskRecord)
      .filter((t): t is Task => t !== null)
  } catch (err) {
    console.error('Failed to load tasks from storage:', err)
    return []
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }
  try {
    window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks))
  } catch (err) {
    console.error('Failed to save tasks to storage:', err)
  }
}

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined' || !window.localStorage) {
    return INITIAL_PROGRESS
  }
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY)
    if (!raw) return INITIAL_PROGRESS
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return INITIAL_PROGRESS

    return {
      totalXP: typeof parsed.totalXP === 'number' ? parsed.totalXP : 0,
      level: typeof parsed.level === 'number' ? parsed.level : 1,
      currentStreak: typeof parsed.currentStreak === 'number' ? parsed.currentStreak : 0,
      longestStreak: typeof parsed.longestStreak === 'number' ? parsed.longestStreak : 0,
      lastCompletionDate: typeof parsed.lastCompletionDate === 'string' ? parsed.lastCompletionDate : null,
      lifetimeCompletedCount: typeof parsed.lifetimeCompletedCount === 'number' ? parsed.lifetimeCompletedCount : 0,
      unlockedAchievements: typeof parsed.unlockedAchievements === 'object' && parsed.unlockedAchievements !== null ? parsed.unlockedAchievements : {},
    }
  } catch (err) {
    console.error('Failed to load user progress:', err)
    return INITIAL_PROGRESS
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress))
  } catch (err) {
    console.error('Failed to save user progress:', err)
  }
}

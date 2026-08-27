import {
  type Task,
  type UserProgress,
  ACHIEVEMENTS,
  getTodayDateString,
} from './tasks'

export const INITIAL_PROGRESS: UserProgress = {
  totalXP: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  lastCompletionDate: null,
  lifetimeCompletedCount: 0,
  unlockedAchievements: {},
}

export function calculateLevel(totalXP: number): number {
  return Math.floor(totalXP / 100) + 1
}

export function calculateLevelProgress(totalXP: number): {
  currentXPInLevel: number
  neededXPForNextLevel: number
  percentage: number
} {
  const currentXPInLevel = totalXP % 100
  const neededXPForNextLevel = 100
  const percentage = Math.round((currentXPInLevel / neededXPForNextLevel) * 100)
  return {
    currentXPInLevel,
    neededXPForNextLevel,
    percentage,
  }
}

export function getYesterdayDateString(referenceDate: Date = new Date()): string {
  const yesterday = new Date(referenceDate)
  yesterday.setDate(yesterday.getDate() - 1)
  return getTodayDateString(yesterday)
}

export function getActiveStreak(
  progress: UserProgress,
  todayStr: string = getTodayDateString()
): number {
  if (!progress.lastCompletionDate || progress.currentStreak === 0) {
    return 0
  }
  if (progress.lastCompletionDate === todayStr) {
    return progress.currentStreak
  }
  const yesterdayStr = getYesterdayDateString(new Date())
  if (progress.lastCompletionDate === yesterdayStr) {
    return progress.currentStreak
  }
  // Streak lapsed if last completion was before yesterday
  return 0
}

export function getTasksCompletedTodayCount(
  tasks: Task[],
  todayStr: string = getTodayDateString()
): number {
  return tasks.filter((task) => {
    if (!task.completed || !task.completedAt) return false
    const completionDateStr = getTodayDateString(new Date(task.completedAt))
    return completionDateStr === todayStr
  }).length
}

export type CompletionRewardResult = {
  updatedProgress: UserProgress
  earnedXP: number
  newlyUnlockedAchievements: Array<{ id: string; title: string; icon: string }>
}

export function processTaskCompletion(
  task: Task,
  currentProgress: UserProgress,
  now: number = Date.now()
): CompletionRewardResult {
  const todayStr = getTodayDateString(new Date(now))
  const yesterdayStr = getYesterdayDateString(new Date(now))

  let earnedXP = 0
  let newTotalXP = currentProgress.totalXP

  // 10 XP awarded only on first completion
  if (!task.rewardGranted) {
    earnedXP = 10
    newTotalXP += 10
  }

  const newLevel = calculateLevel(newTotalXP)
  const newLifetimeCount = currentProgress.lifetimeCompletedCount + 1

  // Calculate streak
  let newStreak: number
  if (currentProgress.lastCompletionDate === todayStr) {
    // Already completed something today; streak stays as is
    newStreak = Math.max(1, currentProgress.currentStreak)
  } else if (currentProgress.lastCompletionDate === yesterdayStr) {
    // Continued from yesterday
    newStreak = currentProgress.currentStreak + 1
  } else {
    // First completion or streak restarted
    newStreak = 1
  }

  const newLongestStreak = Math.max(currentProgress.longestStreak, newStreak)

  const updatedUnlocked: Record<string, number> = {
    ...currentProgress.unlockedAchievements,
  }
  const newlyUnlockedAchievements: Array<{
    id: string
    title: string
    icon: string
  }> = []

  // Check achievements
  const achievementChecks: Record<string, boolean> = {
    'first-step': newLifetimeCount >= 1,
    'getting-things-done': newLifetimeCount >= 10,
    momentum: newStreak >= 3 || newLongestStreak >= 3,
    'task-master': newLifetimeCount >= 50,
  }

  for (const ach of ACHIEVEMENTS) {
    if (!updatedUnlocked[ach.id] && achievementChecks[ach.id]) {
      updatedUnlocked[ach.id] = now
      newlyUnlockedAchievements.push({
        id: ach.id,
        title: ach.title,
        icon: ach.icon,
      })
    }
  }

  const updatedProgress: UserProgress = {
    totalXP: newTotalXP,
    level: newLevel,
    currentStreak: newStreak,
    longestStreak: newLongestStreak,
    lastCompletionDate: todayStr,
    lifetimeCompletedCount: newLifetimeCount,
    unlockedAchievements: updatedUnlocked,
  }

  return {
    updatedProgress,
    earnedXP,
    newlyUnlockedAchievements,
  }
}

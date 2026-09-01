export type TaskStatus = 'todo' | 'in_progress' | 'completed'

export type TaskPriority = 'low' | 'medium' | 'high'

export interface LocalizedString {
  en: string
  ar: string
}

export interface Task {
  id: string
  title: LocalizedString
  description?: LocalizedString
  courseId: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string // ISO date string YYYY-MM-DD
  estimatedMinutes: number
}

export interface Course {
  id: string
  name: LocalizedString
  code: string
  color: string
  instructor: LocalizedString
  credits?: number
  description?: LocalizedString
}

export interface DashboardStats {
  completedTasks: number
  pendingTasks: number
  inProgressTasks: number
  activeCourses: number
  studyStreakDays: number
  totalStudyMinutes: number
}

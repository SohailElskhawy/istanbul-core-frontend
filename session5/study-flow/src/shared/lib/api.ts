import type { Task, Course, DashboardStats } from '../types'
import { mockTasks as initialTasks, mockCourses as initialCourses, calculateDashboardStats } from '../../mocks'

// In-memory persistent state during the session
let tasks: Task[] = [...initialTasks]
let courses: Course[] = [...initialCourses]

const delay = (ms = 400): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

export const api = {
  // Tasks API
  async getTasks(): Promise<Task[]> {
    await delay(350)
    return [...tasks]
  },

  async createTask(newTask: Omit<Task, 'id'>): Promise<Task> {
    await delay(400)
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
    }
    tasks = [task, ...tasks]
    return { ...task }
  },

  async updateTask(id: string, updates: Partial<Omit<Task, 'id'>>): Promise<Task> {
    await delay(300)
    const index = tasks.findIndex((t) => t.id === id)
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`)
    }
    tasks[index] = { ...tasks[index], ...updates }
    return { ...tasks[index] }
  },

  async deleteTask(id: string): Promise<{ success: boolean }> {
    await delay(300)
    tasks = tasks.filter((t) => t.id !== id)
    return { success: true }
  },

  // Courses API
  async getCourses(): Promise<Course[]> {
    await delay(350)
    return [...courses]
  },

  async createCourse(newCourse: Omit<Course, 'id'>): Promise<Course> {
    await delay(400)
    const course: Course = {
      ...newCourse,
      id: `course-${Date.now()}`,
    }
    courses = [...courses, course]
    return { ...course }
  },

  // Dashboard API
  async getDashboard(): Promise<{ stats: DashboardStats; recentTasks: Task[]; courses: Course[] }> {
    await delay(400)
    const stats = calculateDashboardStats(tasks, courses)
    const recentTasks = [...tasks].slice(0, 5)
    return {
      stats,
      recentTasks,
      courses: [...courses],
    }
  },
}

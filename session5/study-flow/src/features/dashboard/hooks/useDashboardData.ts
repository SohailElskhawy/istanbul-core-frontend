import { useQuery } from '@tanstack/react-query'
import { api } from '../../../shared/lib/api'

/**
 * Fetches dashboard data and computes derived values
 * (today's tasks, incomplete tasks, study time estimates, upcoming deadlines).
 */
export function useDashboardData() {
  const { data: dashboard, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.getDashboard(),
  })

  const { data: allTasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.getTasks(),
  })

  // Today's date string (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0]

  // Tasks due today
  const todayTasks = allTasks.filter((task) => task.dueDate === todayStr)

  // Tasks not yet completed
  const incompleteTasks = allTasks.filter((task) => task.status !== 'completed')

  // Total study time remaining for incomplete tasks
  const totalEstimatedMinutes = incompleteTasks.reduce(
    (sum, task) => sum + task.estimatedMinutes,
    0
  )
  const estimatedHours = Math.floor(totalEstimatedMinutes / 60)
  const remainingMins = totalEstimatedMinutes % 60

  // Next 5 upcoming deadlines (sorted by due date, incomplete only)
  const upcomingDeadlines = [...incompleteTasks]
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5)

  return {
    dashboard,
    allTasks,
    isLoading: isDashboardLoading,
    todayTasks,
    incompleteTasks,
    estimatedHours,
    remainingMins,
    upcomingDeadlines,
  }
}

import { useMemo } from 'react'
import { getLocalizedText } from '../../../shared/lib/utils'
import type { Task } from '../../../shared/types'
import type { TaskFilterState } from '../components/TaskFilters'

/**
 * Filters a list of tasks based on search text, status, priority, and course.
 * Memoized to avoid re-filtering on every render.
 */
export function useFilteredTasks(
  tasks: Task[],
  filters: TaskFilterState,
  lang: string
) {
  return useMemo(() => {
    return tasks.filter((task) => {
      const title = getLocalizedText(task.title, lang).toLowerCase()
      const desc = getLocalizedText(task.description, lang).toLowerCase()
      const search = filters.search.toLowerCase()

      // Search filter: check title and description
      if (search && !title.includes(search) && !desc.includes(search)) {
        return false
      }
      // Status filter
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false
      }
      // Priority filter
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false
      }
      // Course filter
      if (filters.courseId !== 'all' && task.courseId !== filters.courseId) {
        return false
      }
      return true
    })
  }, [tasks, filters, lang])
}

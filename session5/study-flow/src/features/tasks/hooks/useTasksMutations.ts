import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../shared/lib/api'
import type { Task } from '../../../shared/types'
import type { TaskFormData } from '../schemas/taskSchema'

/** Converts form data into the API shape for creating/updating tasks. */
function mapFormDataToTask(data: TaskFormData): Omit<Task, 'id'> {
  return {
    title: {
      en: data.titleEn,
      ar: data.titleAr || data.titleEn,
    },
    description:
      data.descriptionEn || data.descriptionAr
        ? {
            en: data.descriptionEn || '',
            ar: data.descriptionAr || data.descriptionEn || '',
          }
        : undefined,
    courseId: data.courseId,
    priority: data.priority,
    status: data.status,
    dueDate: data.dueDate,
    estimatedMinutes: data.estimatedMinutes,
  }
}

/**
 * Encapsulates all task-related mutations (create, update, delete)
 * with automatic query invalidation on success.
 */
export function useTasksMutations() {
  const queryClient = useQueryClient()

  /** Invalidates task and dashboard queries after any mutation. */
  const invalidateRelatedQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  }

  const createTask = useMutation({
    mutationFn: (formData: TaskFormData) =>
      api.createTask(mapFormDataToTask(formData)),
    onSuccess: invalidateRelatedQueries,
  })

  const updateTask = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskFormData }) =>
      api.updateTask(id, mapFormDataToTask(data)),
    onSuccess: invalidateRelatedQueries,
  })

  const updateTaskStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Task['status'] }) =>
      api.updateTask(id, { status }),
    onSuccess: invalidateRelatedQueries,
  })

  const deleteTask = useMutation({
    mutationFn: (id: string) => api.deleteTask(id),
    onSuccess: invalidateRelatedQueries,
  })

  return { createTask, updateTask, updateTaskStatus, deleteTask }
}

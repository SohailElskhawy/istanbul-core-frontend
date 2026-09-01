import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../shared/lib/api'
import type { CourseFormData } from '../schemas/courseSchema'

/** Converts CourseForm data to the API shape for creating a course. */
function mapFormDataToCourse(data: CourseFormData) {
  return {
    name: {
      en: data.nameEn,
      ar: data.nameAr || data.nameEn,
    },
    code: data.code,
    instructor: {
      en: data.instructorEn,
      ar: data.instructorAr || data.instructorEn,
    },
    credits: data.credits,
    color: data.color,
  }
}

/**
 * Encapsulates course creation mutation with automatic query invalidation.
 */
export function useCoursesMutations() {
  const queryClient = useQueryClient()

  const invalidateRelatedQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['courses'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  }

  const createCourse = useMutation({
    mutationFn: (data: CourseFormData) =>
      api.createCourse(mapFormDataToCourse(data)),
    onSuccess: invalidateRelatedQueries,
  })

  return { createCourse }
}

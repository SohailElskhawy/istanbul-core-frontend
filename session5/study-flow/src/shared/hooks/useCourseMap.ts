import { useMemo } from 'react'
import type { Course } from '../types'

/**
 * Creates a memoized Map of course ID → Course object.
 * Avoids re-creating the map on every render when courses haven't changed.
 */
export function useCourseMap(courses: Course[]) {
  return useMemo(
    () => new Map(courses.map((course) => [course.id, course])),
    [courses]
  )
}

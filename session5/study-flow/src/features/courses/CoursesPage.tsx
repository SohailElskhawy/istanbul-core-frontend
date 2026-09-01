import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Plus, BookOpen, AlertCircle } from 'lucide-react'
import { api } from '../../shared/lib/api'
import { PageHeader } from '../../shared/components/PageHeader'
import { Button } from '../../shared/components/Button'
import { EmptyState } from '../../shared/components/EmptyState'
import { Dialog } from '../../shared/components/Dialog'
import { Skeleton } from '../../shared/components/Skeleton'
import { CourseCard } from './components/CourseCard'
import { CourseForm } from './components/CourseForm'
import { useCoursesMutations } from './hooks/useCoursesMutations'
import type { CourseFormData } from './schemas/courseSchema'

export function CoursesPage() {
  const { t } = useTranslation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const {
    data: courses = [],
    isLoading: isLoadingCourses,
    isError: isCoursesError,
    refetch,
  } = useQuery({
    queryKey: ['courses'],
    queryFn: () => api.getCourses(),
  })

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.getTasks(),
  })

  const { createCourse } = useCoursesMutations()

  const handleCreateCourse = (data: CourseFormData) => {
    createCourse.mutate(data, {
      onSuccess: () => setIsDialogOpen(false),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('courses.title')}
        subtitle={t('courses.subtitle')}
        action={
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>{t('courses.addCourse')}</span>
          </Button>
        }
      />

      {/* Loading State */}
      {isLoadingCourses && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* Error State */}
      {isCoursesError && (
        <div className="p-6 rounded-xl border border-(--danger)/30 bg-(--danger)/10 text-center space-y-3">
          <AlertCircle className="h-6 w-6 text-(--danger) mx-auto" />
          <p className="text-sm font-medium text-(--danger)">
            {t('courses.loadError')}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            {t('courses.retry')}
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoadingCourses && !isCoursesError && courses.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title={t('courses.noCoursesTitle')}
          description={t('courses.noCoursesDesc')}
          action={
            <Button variant="secondary" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              <span>{t('courses.createCourse')}</span>
            </Button>
          }
        />
      )}

      {/* Course Cards */}
      {!isLoadingCourses && !isCoursesError && courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} tasks={tasks} />
          ))}
        </div>
      )}

      {/* Create Course Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={t('courses.createCourse')}
        description={t('courses.subtitle')}
        maxWidth="lg"
      >
        <CourseForm
          onSubmit={handleCreateCourse}
          onCancel={() => setIsDialogOpen(false)}
          isLoading={createCourse.isPending}
        />
      </Dialog>
    </div>
  )
}

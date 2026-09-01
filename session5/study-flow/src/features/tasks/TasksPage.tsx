import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import type { Task } from '../../shared/types'
import { api } from '../../shared/lib/api'
import { PageHeader } from '../../shared/components/PageHeader'
import { Button } from '../../shared/components/Button'
import { Dialog } from '../../shared/components/Dialog'
import { ConfirmDialog } from '../../shared/components/ConfirmDialog'
import { TaskFilters, type TaskFilterState } from './components/TaskFilters'
import { TaskList } from './components/TaskList'
import { TaskForm } from './components/TaskForm'
import { useTasksMutations } from './hooks/useTasksMutations'
import { useFilteredTasks } from './hooks/useFilteredTasks'
import type { TaskFormData } from './schemas/taskSchema'

export function TasksPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  // Filter state
  const [filters, setFilters] = useState<TaskFilterState>({
    search: '',
    status: 'all',
    priority: 'all',
    courseId: 'all',
  })

  // Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)

  // Server data
  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.getTasks(),
  })

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: () => api.getCourses(),
  })

  // Hooks
  const { createTask, updateTask, updateTaskStatus, deleteTask } = useTasksMutations()
  const filteredTasks = useFilteredTasks(tasks, filters, lang)

  // Handlers
  const handleOpenCreate = () => {
    setEditingTask(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingTask(null)
  }

  const handleFormSubmit = (data: TaskFormData) => {
    const onSuccess = () => handleCloseForm()

    if (editingTask) {
      updateTask.mutate({ id: editingTask.id, data }, { onSuccess })
    } else {
      createTask.mutate(data, { onSuccess })
    }
  }

  const handleConfirmDelete = () => {
    if (!deletingTaskId) return
    deleteTask.mutate(deletingTaskId, {
      onSuccess: () => setDeletingTaskId(null),
    })
  }

  const isMutating = createTask.isPending || updateTask.isPending

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('tasks.title')}
        subtitle={t('tasks.subtitle')}
        action={
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4" />
            <span>{t('tasks.addTask')}</span>
          </Button>
        }
      />

      <TaskFilters filters={filters} courses={courses} onChange={setFilters} />

      <TaskList
        tasks={filteredTasks}
        courses={courses}
        isLoading={isLoadingTasks}
        onEdit={handleOpenEdit}
        onDelete={(id) => setDeletingTaskId(id)}
        onStatusChange={(id, status) => updateTaskStatus.mutate({ id, status })}
        onCreateTaskClick={handleOpenCreate}
      />

      {/* Create / Edit Form Dialog */}
      <Dialog
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingTask ? t('tasks.editTask') : t('tasks.createTask')}
        description={t('tasks.subtitle')}
        maxWidth="lg"
      >
        <TaskForm
          initialTask={editingTask}
          courses={courses}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
          isLoading={isMutating}
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deletingTaskId !== null}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={handleConfirmDelete}
        title={t('common.confirmDelete')}
        description={t('common.confirmDeleteDesc')}
        isLoading={deleteTask.isPending}
      />
    </div>
  )
}

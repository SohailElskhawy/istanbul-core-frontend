import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import TaskForm from './TaskForm'
import type { Task, TaskDraft } from '@/lib/tasks'

type EditTaskDialogProps = {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: string, draft: TaskDraft) => void
}

export default function EditTaskDialog({
  task,
  open,
  onOpenChange,
  onSave,
}: EditTaskDialogProps) {
  if (!task) return null

  const handleSave = (draft: TaskDraft) => {
    onSave(task.id, draft)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update the title and timeframe for this task.
          </DialogDescription>
        </DialogHeader>

        <TaskForm
          key={task.id}
          initialValues={{
            title: task.title,
            startDate: task.startDate,
            endDate: task.endDate,
          }}
          submitLabel="Save changes"
          onSubmit={handleSave}
          onCancel={() => onOpenChange(false)}
          formId="edit-task-form"
        />
      </DialogContent>
    </Dialog>
  )
}

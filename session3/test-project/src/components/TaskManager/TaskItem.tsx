import { useState } from 'react'
import { type Task, getTaskStatus } from '@/lib/tasks'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Calendar, Check, Pencil, Share2, Trash2 } from 'lucide-react'
import { shareTask } from '@/lib/share-task'
import { toast } from 'sonner'

type TaskItemProps = {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
}

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
}: TaskItemProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const status = getTaskStatus(task)

  const handleShare = async () => {
    setIsSharing(true)
    try {
      const result = await shareTask(task)
      if (result.success) {
        toast.success(result.message || 'Task shared!')
      } else if (result.method !== 'native') {
        toast.error(result.message || 'Could not share task.')
      }
    } catch {
      toast.error('Failed to share task.')
    } finally {
      setIsSharing(false)
    }
  }

  const statusVariant =
    status === 'Completed'
      ? 'completed'
      : status === 'Scheduled'
      ? 'scheduled'
      : 'active'

  return (
    <>
      <li
        className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-neutral-200/80 bg-white hover:border-indigo-200 transition-all shadow-xs ${
          task.completed ? 'bg-neutral-50/70 border-neutral-200/50' : ''
        }`}
      >
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          <label className="relative flex items-center justify-center cursor-pointer mt-0.5 select-none">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
              aria-label={
                task.completed
                  ? `Mark "${task.title}" as incomplete`
                  : `Mark "${task.title}" as complete`
              }
              className="sr-only peer"
            />
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                task.completed
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'border-neutral-300 bg-white hover:border-indigo-500 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2'
              }`}
            >
              {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </label>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-sm font-medium text-neutral-900 break-words ${
                  task.completed
                    ? 'line-through text-neutral-400 decoration-neutral-300'
                    : ''
                }`}
              >
                {task.title}
              </span>
              <Badge variant={statusVariant} className="text-[11px] py-0 px-2">
                {status}
              </Badge>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>
                {task.startDate === task.endDate ? (
                  <span>Due {task.startDate}</span>
                ) : (
                  <span>
                    {task.startDate} <span className="text-neutral-300">→</span> {task.endDate}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 self-end sm:self-center shrink-0 opacity-90 sm:opacity-70 group-hover:opacity-100 transition-opacity">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleShare}
            disabled={isSharing}
            aria-label={`Share "${task.title}"`}
            title="Share task"
            className="h-8 w-8 text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50"
          >
            <Share2 className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            aria-label={`Edit "${task.title}"`}
            title="Edit task"
            className="h-8 w-8 text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50"
          >
            <Pencil className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setDeleteDialogOpen(true)}
            aria-label={`Delete "${task.title}"`}
            title="Delete task"
            className="h-8 w-8 text-neutral-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </li>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{task.title}&rdquo;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(task.id)
                setDeleteDialogOpen(false)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

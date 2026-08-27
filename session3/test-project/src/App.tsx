import { useEffect, useState } from 'react'
import Header from './components/TaskManager/Header'
import TaskForm from './components/TaskManager/TaskForm'
import TaskToolbar from './components/TaskManager/TaskToolbar'
import TaskList from './components/TaskManager/TaskList'
import EditTaskDialog from './components/TaskManager/EditTaskDialog'
import AchievementsModal from './components/TaskManager/AchievementsModal'

import {
  createTaskId,
  loadProgress,
  loadTasks,
  saveProgress,
  saveTasks,
} from './lib/task-storage'
import {
  getActiveStreak,
  getTasksCompletedTodayCount,
  processTaskCompletion,
} from './lib/task-engine'
import type { Task, TaskFilter, TaskDraft, UserProgress } from './lib/tasks'
import { Toaster, toast } from 'sonner'
import './App.css'

function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [progress, setProgress] = useState<UserProgress>(loadProgress)
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false)

  // Persist tasks and user progress
  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const handleAddTask = (draft: TaskDraft) => {
    const now = Date.now()
    const newTask: Task = {
      id: createTaskId(),
      title: draft.title,
      startDate: draft.startDate,
      endDate: draft.endDate,
      completed: false,
      completedAt: null,
      rewardGranted: false,
      createdAt: now,
      updatedAt: now,
    }

    setTasks((current) => [newTask, ...current])
    toast.success('Task created!')
  }

  const handleToggleTask = (id: string) => {
    const targetTask = tasks.find((t) => t.id === id)
    if (!targetTask) return

    const now = Date.now()
    const nextCompleted = !targetTask.completed

    if (nextCompleted) {
      // Process reward, streak, and achievements
      const { updatedProgress, earnedXP, newlyUnlockedAchievements } =
        processTaskCompletion(targetTask, progress, now)

      setProgress(updatedProgress)

      if (earnedXP > 0) {
        toast.success(`Completed! +${earnedXP} XP earned 🎉`)
      } else {
        toast.success('Task completed!')
      }

      if (updatedProgress.level > progress.level) {
        toast.success(
          `🌟 Level Up! You reached Level ${updatedProgress.level}!`,
          { duration: 4000 }
        )
      }

      for (const ach of newlyUnlockedAchievements) {
        toast.success(
          `🏆 Achievement Unlocked: ${ach.icon} ${ach.title}!`,
          { duration: 5000 }
        )
      }

      setTasks((current) =>
        current.map((t) =>
          t.id === id
            ? {
                ...t,
                completed: true,
                completedAt: now,
                rewardGranted: true,
                updatedAt: now,
              }
            : t
        )
      )
    } else {
      // Reopening task (does not deduct XP or reset reward eligibility)
      setTasks((current) =>
        current.map((t) =>
          t.id === id
            ? {
                ...t,
                completed: false,
                completedAt: null,
                updatedAt: now,
              }
            : t
        )
      )
      toast.info('Task reopened.')
    }
  }

  const handleEditTask = (id: string, draft: TaskDraft) => {
    const now = Date.now()
    setTasks((current) =>
      current.map((t) =>
        t.id === id
          ? {
              ...t,
              title: draft.title,
              startDate: draft.startDate,
              endDate: draft.endDate,
              updatedAt: now,
            }
          : t
      )
    )
    toast.success('Task updated!')
  }

  const handleDeleteTask = (id: string) => {
    setTasks((current) => current.filter((t) => t.id !== id))
    toast.success('Task deleted.')
  }

  const handleClearCompleted = () => {
    const completedCount = tasks.filter((t) => t.completed).length
    if (completedCount === 0) return
    setTasks((current) => current.filter((t) => !t.completed))
    toast.success(`Cleared ${completedCount} completed task${completedCount === 1 ? '' : 's'}.`)
  }

  const handleResetFilters = () => {
    setFilter('all')
    setSearchQuery('')
  }

  const completed = tasks.filter((task) => task.completed).length
  const active = tasks.length - completed
  const completionPercentage =
    tasks.length === 0 ? 0 : (completed / tasks.length) * 100

  const activeStreak = getActiveStreak(progress)
  const completedTodayCount = getTasksCompletedTodayCount(tasks)

  const counts = {
    all: tasks.length,
    active,
    completed,
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-neutral-900">
      <Toaster position="top-right" richColors />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        <Header
          total={tasks.length}
          active={active}
          completed={completed}
          completionPercentage={completionPercentage}
          progress={progress}
          completedTodayCount={completedTodayCount}
          activeStreak={activeStreak}
          onClearCompleted={handleClearCompleted}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
        />

        {/* Task Creation Card */}
        <section
          className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200 shadow-xs space-y-4"
          aria-label="Create new task"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-neutral-900">
              Add a new task
            </h2>
            <span className="text-xs text-neutral-400 font-medium">
              Start & End dates required
            </span>
          </div>
          <TaskForm onSubmit={handleAddTask} submitLabel="Add task" />
        </section>

        {/* Task List & Filter Section */}
        <section
          className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200 shadow-xs space-y-5"
          aria-label="Your task list"
        >
          <TaskToolbar
            query={searchQuery}
            filter={filter}
            counts={counts}
            onQueryChange={setSearchQuery}
            onFilterChange={setFilter}
          />

          <TaskList
            tasks={tasks}
            filter={filter}
            searchQuery={searchQuery}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
            onEdit={(task) => setEditingTask(task)}
            onResetFilters={handleResetFilters}
          />
        </section>

        {tasks.length === 0 && (
          <p className="text-center text-xs text-neutral-400">
            <span className="text-indigo-500 font-bold mr-1">✦</span>
            Small daily steps build lifelong momentum.
          </p>
        )}
      </main>

      {/* Edit Task Dialog */}
      <EditTaskDialog
        task={editingTask}
        open={Boolean(editingTask)}
        onOpenChange={(open) => {
          if (!open) setEditingTask(null)
        }}
        onSave={handleEditTask}
      />

      {/* Achievements Modal */}
      <AchievementsModal
        progress={progress}
        open={isAchievementsOpen}
        onOpenChange={setIsAchievementsOpen}
      />
    </div>
  )
}

export default App

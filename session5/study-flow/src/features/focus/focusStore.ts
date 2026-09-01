import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FocusStatus = 'idle' | 'running' | 'paused'

interface FocusState {
  taskId: string | null
  startedAt: number | null
  duration: number       // total duration in seconds (e.g. 1500 = 25min)
  remainingSeconds: number
  status: FocusStatus
  savedAt: number | null // timestamp of last state save (for reconciliation)
}

interface FocusActions {
  start: (taskId?: string | null, durationMinutes?: number) => void
  pause: () => void
  resume: () => void
  reset: () => void
  tick: () => void
  setDuration: (durationMinutes: number) => void
  setTaskId: (taskId: string | null) => void
}

type FocusStore = FocusState & FocusActions

/** Default state when no session is active. */
const DEFAULT_FOCUS_STATE: FocusState = {
  taskId: null,
  startedAt: null,
  duration: 25 * 60,
  remainingSeconds: 25 * 60,
  status: 'idle',
  savedAt: null,
}

export const useFocusStore = create<FocusStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_FOCUS_STATE,

      setDuration: (durationMinutes: number) => {
        const duration = durationMinutes * 60
        set({
          duration,
          remainingSeconds: duration,
          savedAt: Date.now(),
        })
      },

      setTaskId: (taskId: string | null) => {
        set({
          taskId,
          savedAt: Date.now(),
        })
      },

      start: (taskId, durationMinutes) => {
        const currentDuration = durationMinutes
          ? durationMinutes * 60
          : get().duration || 25 * 60
        const currentTaskId = taskId !== undefined ? taskId : get().taskId

        set({
          taskId: currentTaskId,
          startedAt: Date.now(),
          duration: currentDuration,
          remainingSeconds: currentDuration,
          status: 'running',
          savedAt: Date.now(),
        })
      },

      pause: () => {
        set({ status: 'paused', savedAt: Date.now() })
      },

      resume: () => {
        set({ status: 'running', savedAt: Date.now() })
      },

      reset: () => {
        const duration = get().duration || 25 * 60
        set({
          startedAt: null,
          remainingSeconds: duration,
          status: 'idle',
          savedAt: Date.now(),
        })
      },

      tick: () => {
        const { status, remainingSeconds } = get()
        if (status !== 'running') return

        if (remainingSeconds <= 1) {
          set({ remainingSeconds: 0, status: 'idle', savedAt: Date.now() })
        } else {
          set({ remainingSeconds: remainingSeconds - 1, savedAt: Date.now() })
        }
      },
    }),
    {
      name: 'studyflow-focus-session',
      // On rehydration, reconcile elapsed time if the timer was running
      onRehydrateStorage: () => (state) => {
        if (!state) return
        if (state.status === 'running' && state.savedAt) {
          const elapsedSinceSave = Math.floor((Date.now() - state.savedAt) / 1000)
          const currentRemaining = Math.max(0, state.remainingSeconds - elapsedSinceSave)
          state.remainingSeconds = currentRemaining
          state.status = currentRemaining === 0 ? 'idle' : 'running'
          state.savedAt = Date.now()
        }
      },
    }
  )
)

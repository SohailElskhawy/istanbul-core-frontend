import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Play, Pause, RotateCcw, Timer, Flame } from 'lucide-react'
import { api } from '../../shared/lib/api'
import { useLocalizedText } from '../../shared/hooks/useLocalizedText'
import { useCourseMap } from '../../shared/hooks/useCourseMap'
import { useFocusStore } from './focusStore'
import { PageHeader } from '../../shared/components/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/components/Card'
import { Button } from '../../shared/components/Button'
import { Select } from '../../shared/components/Select'
import { Badge } from '../../shared/components/Badge'
import { CourseBadge } from '../../shared/components/CourseBadge'
import { ProgressBar } from '../../shared/components/ProgressBar'

const PRESET_DURATIONS = [
  { labelKey: 'focus.preset15', value: 15 },
  { labelKey: 'focus.preset25', value: 25 },
  { labelKey: 'focus.preset45', value: 45 },
  { labelKey: 'focus.preset60', value: 60 },
]

/**
 * Focus Mode page with a Pomodoro-style timer.
 * Lets users start timed study sessions optionally linked to a task.
 */
export function FocusPage() {
  const { t } = useTranslation()
  const localize = useLocalizedText()

  // Zustand focus store
  const {
    taskId,
    remainingSeconds,
    duration,
    status,
    start,
    pause,
    resume,
    reset,
    setDuration,
    setTaskId,
  } = useFocusStore()

  // Server data for task/course metadata
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.getTasks(),
  })

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: () => api.getCourses(),
  })

  const courseMap = useCourseMap(courses)
  const activeTask = tasks.find((task) => task.id === taskId)
  const activeCourse = activeTask ? courseMap.get(activeTask.courseId) : undefined

  // Timer display
  const mins = Math.floor(remainingSeconds / 60)
  const secs = remainingSeconds % 60
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

  // Progress percentage
  const progressPercent =
    duration > 0 ? Math.round(((duration - remainingSeconds) / duration) * 100) : 0

  const handleStartOrResume = () => {
    if (status === 'paused') {
      resume()
    } else {
      start()
    }
  }

  // Status message
  const statusMessage =
    status === 'running'
      ? t('focus.sessionInProgress')
      : status === 'paused'
        ? t('focus.sessionPaused')
        : t('focus.readyToFocus')

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader title={t('focus.title')} subtitle={t('focus.subtitle')} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Timer Card */}
        <Card className="lg:col-span-2 p-8 text-center flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-(--primary)/10 text-(--primary) shadow-xs">
            <Timer className="h-7 w-7" />
          </div>

          {/* Active Task Pill */}
          {activeTask ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-(--surface-subtle) border border-(--border) max-w-md">
              {activeCourse && (
                <CourseBadge code={activeCourse.code} color={activeCourse.color} />
              )}
              <span className="text-xs font-semibold text-(--foreground) truncate">
                {localize(activeTask.title)}
              </span>
            </div>
          ) : (
            <Badge variant="outline" className="text-xs">
              {t('focus.generalSession')}
            </Badge>
          )}

          {/* Timer Display */}
          <div className="space-y-2">
            <div className="text-7xl font-extrabold tracking-tight text-(--foreground) font-mono tabular-nums select-none">
              {formattedTime}
            </div>
            <p className="text-xs text-(--muted-foreground) font-medium">
              {statusMessage}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xs">
            <ProgressBar percent={progressPercent} />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {status === 'running' ? (
              <Button size="lg" onClick={pause} className="min-w-[140px]">
                <Pause className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
                <span>{t('focus.pauseFocus')}</span>
              </Button>
            ) : (
              <Button size="lg" onClick={handleStartOrResume} className="min-w-[140px]">
                <Play className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
                <span>{status === 'paused' ? t('focus.resume') : t('focus.startFocus')}</span>
              </Button>
            )}

            <Button
              variant="secondary"
              size="lg"
              onClick={reset}
              disabled={status === 'idle' && remainingSeconds === duration}
            >
              <RotateCcw className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
              <span>{t('focus.reset')}</span>
            </Button>
          </div>
        </Card>

        {/* Settings Panel */}
        <div className="space-y-4">
          <Card className="p-5 space-y-4 text-left rtl:text-right">
            <CardHeader className="p-0 pb-1">
              <CardTitle className="text-sm">{t('focus.sessionSettings')}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              {/* Task Selector */}
              <Select
                label={t('focus.linkTask')}
                value={taskId || ''}
                disabled={status !== 'idle'}
                onChange={(e) => setTaskId(e.target.value || null)}
              >
                <option value="">{t('focus.noLinkedTask')}</option>
                {tasks
                  .filter((task) => task.status !== 'completed')
                  .map((task) => (
                    <option key={task.id} value={task.id}>
                      {localize(task.title)}
                    </option>
                  ))}
              </Select>

              {/* Duration Presets */}
              <div className="space-y-2 text-left rtl:text-right">
                <label className="block text-xs font-semibold text-(--foreground)">
                  {t('focus.sessionDuration')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_DURATIONS.map((preset) => {
                    const isSelected = Math.round(duration / 60) === preset.value
                    return (
                      <button
                        key={preset.value}
                        type="button"
                        disabled={status !== 'idle'}
                        onClick={() => status === 'idle' && setDuration(preset.value)}
                        className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-(--primary) bg-(--primary)/10 text-(--primary) font-semibold'
                            : 'border-(--border) bg-(--surface) text-(--foreground) hover:bg-(--surface-subtle)'
                        } ${status !== 'idle' ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        {t(preset.labelKey)}
                      </button>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pomodoro Tip */}
          <Card className="p-4 bg-(--surface-subtle)/50 border-dashed space-y-2 text-left rtl:text-right">
            <div className="flex items-center gap-2 text-xs font-semibold text-(--foreground)">
              <Flame className="h-4 w-4 text-(--warning)" />
              <span>{t('focus.pomodoroTechnique')}</span>
            </div>
            <p className="text-xs text-(--muted-foreground) leading-relaxed">
              {t('focus.pomodoroTip')}
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

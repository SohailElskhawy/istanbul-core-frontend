import LiveClock from './LiveClock'
import type { UserProgress } from '@/lib/tasks'
import { calculateLevelProgress } from '@/lib/task-engine'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Trophy, Flame, Zap, CheckCircle2, Trash2 } from 'lucide-react'

type HeaderProps = {
  total: number
  active: number
  completed: number
  completionPercentage: number
  progress: UserProgress
  completedTodayCount: number
  activeStreak: number
  onClearCompleted?: () => void
  onOpenAchievements?: () => void
}

export default function Header({
  total,
  active,
  completed,
  completionPercentage,
  progress,
  completedTodayCount,
  activeStreak,
  onClearCompleted,
  onOpenAchievements,
}: HeaderProps) {
  const normalizedPercentage = Math.max(
    0,
    Math.min(100, Math.round(completionPercentage))
  )
  const levelInfo = calculateLevelProgress(progress.totalXP)
  const unlockedAchievementsCount = Object.keys(
    progress.unlockedAchievements
  ).length

  return (
    <header className="space-y-6">
      {/* Top Bar with Live Date/Time and Brand */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-widest text-indigo-600 uppercase">
            TASK MANAGER
          </span>
          <span className="text-neutral-300">•</span>
          <span className="text-[11px] font-medium text-neutral-500">
            Personal Flow
          </span>
        </div>
        <LiveClock />
      </div>

      {/* Main Title & Gamification Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">
            Today&apos;s focus
          </h1>
          <p className="text-sm text-neutral-500 mt-1 max-w-md">
            Capture what matters, stay consistent, and watch your progress grow.
          </p>
        </div>

        {/* Motivational / Gamification Card */}
        <div className="flex flex-wrap items-center gap-2.5 bg-white p-3 sm:p-4 rounded-xl border border-neutral-200 shadow-xs">
          {/* Level & XP */}
          <div className="flex items-center gap-2 pr-3 border-r border-neutral-200">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
              L{progress.level}
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs font-semibold text-neutral-900">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>{progress.totalXP} XP</span>
              </div>
              <div className="w-20 mt-1">
                <Progress value={levelInfo.percentage} className="h-1.5" />
              </div>
            </div>
          </div>

          {/* Daily Streak */}
          <div className="flex items-center gap-2 pr-3 border-r border-neutral-200">
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-neutral-900">
                {activeStreak} {activeStreak === 1 ? 'day' : 'days'}
              </div>
              <div className="text-[10px] text-neutral-500">
                Streak ({progress.longestStreak} max)
              </div>
            </div>
          </div>

          {/* Today's Completed */}
          <div className="flex items-center gap-2 pr-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-neutral-900">
                {completedTodayCount} done
              </div>
              <div className="text-[10px] text-neutral-500">Today</div>
            </div>
          </div>

          {/* Achievements Button */}
          {onOpenAchievements && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenAchievements}
              className="h-9 px-3 gap-1.5 text-xs text-neutral-700 hover:text-indigo-600 hover:border-indigo-200"
              title="View achievements"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Badges</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold">
                {unlockedAchievementsCount}
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* Progress & Task Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-4 bg-white/80 backdrop-blur-xs rounded-xl border border-neutral-200 shadow-xs">
        <div className="sm:col-span-4 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">Total:</span>
            <Badge variant="outline" className="font-mono text-xs font-semibold">
              {total}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">Active:</span>
            <Badge variant="active" className="font-mono text-xs font-semibold">
              {active}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">Completed:</span>
            <Badge
              variant="completed"
              className="font-mono text-xs font-semibold"
            >
              {completed}
            </Badge>
          </div>
        </div>

        <div className="sm:col-span-5 flex items-center gap-3">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs text-neutral-600">
              <span className="font-medium">Completion Rate</span>
              <span className="font-mono font-semibold">{normalizedPercentage}%</span>
            </div>
            <Progress value={normalizedPercentage} className="h-2" />
          </div>
        </div>

        <div className="sm:col-span-3 flex justify-end">
          {onClearCompleted && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearCompleted}
              disabled={completed === 0}
              className="text-xs text-neutral-600 hover:text-red-600 hover:bg-red-50 disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Clear completed ({completed})
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

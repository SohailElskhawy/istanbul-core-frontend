import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ACHIEVEMENTS, type UserProgress, getTodayDateString } from '@/lib/tasks'
import { Trophy, Lock, CheckCircle2 } from 'lucide-react'

type AchievementsModalProps = {
  progress: UserProgress
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AchievementsModal({
  progress,
  open,
  onOpenChange,
}: AchievementsModalProps) {
  const unlockedCount = Object.keys(progress.unlockedAchievements).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle>Achievements</DialogTitle>
              <DialogDescription>
                Earn badges as you build steady task-management habits.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-neutral-50 border border-neutral-200/70 text-xs text-neutral-600">
          <span>
            Unlocked: <strong>{unlockedCount}</strong> / {ACHIEVEMENTS.length}
          </span>
          <span>
            Lifetime Completed: <strong>{progress.lifetimeCompletedCount}</strong>
          </span>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {ACHIEVEMENTS.map((achievement) => {
            const unlockedTimestamp =
              progress.unlockedAchievements[achievement.id]
            const isUnlocked = Boolean(unlockedTimestamp)
            const unlockDate = isUnlocked
              ? getTodayDateString(new Date(unlockedTimestamp))
              : null

            return (
              <div
                key={achievement.id}
                className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'border-amber-200/80 bg-amber-50/40 shadow-xs'
                    : 'border-neutral-200 bg-neutral-50/50 opacity-70'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                    isUnlocked
                      ? 'bg-amber-100/80 shadow-xs'
                      : 'bg-neutral-200/70 text-neutral-400 grayscale'
                  }`}
                >
                  {achievement.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-neutral-900">
                      {achievement.title}
                    </h4>
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 bg-neutral-200/60 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    {achievement.description}
                  </p>
                  {unlockDate && (
                    <p className="text-[10px] text-neutral-400 mt-1">
                      Unlocked on {unlockDate}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

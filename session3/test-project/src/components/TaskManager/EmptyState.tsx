import { Button } from '@/components/ui/button'
import { Sparkles, SearchX } from 'lucide-react'

type EmptyStateProps = {
  isFiltered?: boolean
  filter?: 'all' | 'active' | 'completed'
  hasQuery?: boolean
  onResetFilters?: () => void
}

export default function EmptyState({
  isFiltered = false,
  filter = 'all',
  hasQuery = false,
  onResetFilters,
}: EmptyStateProps) {
  if (hasQuery || isFiltered) {
    return (
      <div
        className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50/50"
        aria-live="polite"
      >
        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-neutral-800 mb-1">
          No matching tasks found
        </h3>
        <p className="text-sm text-neutral-500 max-w-sm mb-4">
          {hasQuery
            ? 'No tasks match your search query and filter combination.'
            : filter === 'active'
            ? 'You have no active or scheduled tasks right now.'
            : 'You have not completed any tasks yet.'}
        </p>
        {onResetFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="text-xs"
          >
            Clear search and filters
          </Button>
        )}
      </div>
    )
  }

  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50/50"
      aria-live="polite"
    >
      <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
        <Sparkles className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-neutral-800 mb-1">
        No tasks yet
      </h3>
      <p className="text-sm text-neutral-500 max-w-sm">
        Add your first task above with a title, start date, and end date to get
        started!
      </p>
    </div>
  )
}

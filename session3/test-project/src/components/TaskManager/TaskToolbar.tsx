import type { TaskFilter } from '@/lib/tasks'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'

type TaskToolbarProps = {
  query: string
  filter: TaskFilter
  counts: {
    all: number
    active: number
    completed: number
  }
  onQueryChange: (query: string) => void
  onFilterChange: (filter: TaskFilter) => void
}

const filters: ReadonlyArray<{ value: TaskFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

export default function TaskToolbar({
  query,
  filter,
  counts,
  onQueryChange,
  onFilterChange,
}: TaskToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pb-3 border-b border-neutral-200">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
        <Input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search tasks by title..."
          className="pl-9 pr-8 h-9 text-sm"
          aria-label="Search tasks by title"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div
        className="inline-flex rounded-lg bg-neutral-100 p-1 self-start sm:self-auto"
        role="group"
        aria-label="Filter tasks by status"
      >
        {filters.map((item) => {
          const isActive = filter === item.value
          const count = counts[item.value]
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onFilterChange(item.value)}
              aria-pressed={isActive}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'bg-neutral-200 text-neutral-600'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

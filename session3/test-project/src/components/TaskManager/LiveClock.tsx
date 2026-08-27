import { useState, useEffect } from 'react'
import { Calendar, Clock } from 'lucide-react'

export default function LiveClock() {
  const [currentDateTime, setCurrentDateTime] = useState<Date>(() => new Date())

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(timerId)
  }, [])

  const formattedDate = currentDateTime.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const formattedTime = currentDateTime.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })

  return (
    <div
      className="inline-flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 rounded-full bg-white border border-neutral-200/80 shadow-2xs text-xs font-medium text-neutral-700 select-none"
      aria-label={`Current date and time: ${formattedDate} ${formattedTime}`}
    >
      <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold tracking-wide uppercase border border-emerald-200/60">
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
        </span>
        LIVE
      </div>

      <div className="flex items-center gap-1 text-neutral-600">
        <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
        <span className="whitespace-nowrap">{formattedDate}</span>
      </div>

      <span className="text-neutral-300" aria-hidden="true">
        •
      </span>

      <div className="flex items-center gap-1 font-mono text-neutral-900 font-semibold">
        <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
        <span className="whitespace-nowrap">{formattedTime}</span>
      </div>
    </div>
  )
}

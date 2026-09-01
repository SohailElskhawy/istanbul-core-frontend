import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  Timer,
  GraduationCap,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { cn } from '../shared/lib/utils'
import { useSidebarStore } from '../shared/lib/sidebarStore'
import { ThemeToggle } from '../shared/components/ThemeToggle'
import { LanguageToggle } from '../shared/components/LanguageToggle'
import { Button } from '../shared/components/Button'
import { FocusTimerIndicator } from '../features/focus/components/FocusTimerIndicator'
import { useFocusTimer } from '../features/focus/hooks/useFocusTimer'

interface NavItem {
  to: string
  labelKey: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { to: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/tasks', labelKey: 'nav.tasks', icon: CheckSquare },
  { to: '/courses', labelKey: 'nav.courses', icon: BookOpen },
  { to: '/focus', labelKey: 'nav.focus', icon: Timer },
]

/**
 * Root application layout with responsive sidebar (desktop) and bottom nav (mobile).
 * Also drives the focus timer interval via useFocusTimer hook.
 */
export function AppLayout() {
  const { t } = useTranslation()
  const { isCollapsed, toggleSidebar } = useSidebarStore()

  // Drive the focus timer — ticks every second while a session is running
  useFocusTimer()

  return (
    <div className="min-h-screen bg-(--background) text-(--foreground) flex flex-col md:flex-row transition-colors duration-150">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r rtl:border-r-0 rtl:border-l border-(--border) bg-(--surface) shrink-0 transition-all duration-200 ease-in-out',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-(--border)">
          <div className={cn('flex items-center gap-3 overflow-hidden', isCollapsed && 'justify-center w-full')}>
            <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-(--primary) text-(--primary-foreground) shadow-xs shrink-0">
              <GraduationCap className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="font-bold text-sm leading-tight text-(--foreground) tracking-tight truncate">
                  {t('appName')}
                </h1>
                <p className="text-[11px] text-(--muted-foreground) font-medium truncate">
                  {t('appSubtitle')}
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              aria-label="Collapse sidebar"
              className="h-8 w-8 text-(--muted-foreground) hover:text-(--foreground)"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                title={isCollapsed ? t(item.labelKey) : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                    isCollapsed && 'justify-center px-0',
                    isActive
                      ? 'bg-(--primary)/10 text-(--primary) font-semibold'
                      : 'text-(--muted-foreground) hover:bg-(--surface-subtle) hover:text-(--foreground)'
                  )
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span className="truncate">{t(item.labelKey)}</span>}
              </NavLink>
            )
          })}
        </nav>

        {/* Focus Timer Indicator (sidebar) */}
        <div className="px-3 pb-3">
          <FocusTimerIndicator compact={isCollapsed} />
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-(--border) space-y-3">
          <div
            className={cn(
              'flex items-center gap-2',
              isCollapsed ? 'flex-col justify-center' : 'justify-between'
            )}
          >
            <LanguageToggle />
            <ThemeToggle />
            {isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                aria-label="Expand sidebar"
                className="h-8 w-8 text-(--muted-foreground) hover:text-(--foreground)"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </Button>
            )}
          </div>

          {!isCollapsed && (
            <div className="rounded-lg bg-(--surface-subtle) px-3 py-2 text-center text-[11px] text-(--muted-foreground) font-medium">
              {t('footerTagline')}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="flex md:hidden items-center justify-between px-4 py-3 border-b border-(--border) bg-(--surface) sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-(--primary) text-(--primary-foreground) shadow-xs">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="font-bold text-sm text-(--foreground) tracking-tight">
            {t('appName')}
          </span>
          <FocusTimerIndicator compact className="ml-2" />
        </div>
        <div className="flex items-center gap-1.5">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8 overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-40 bg-(--surface) border-t border-(--border) px-2 py-1 justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-[10px] font-medium transition-colors flex-1',
                  isActive
                    ? 'text-(--primary) font-semibold'
                    : 'text-(--muted-foreground) hover:text-(--foreground)'
                )
              }
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span>{t(item.labelKey)}</span>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}

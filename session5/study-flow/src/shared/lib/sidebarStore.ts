import { create } from 'zustand'

interface SidebarState {
  isCollapsed: boolean
  toggleSidebar: () => void
  setCollapsed: (collapsed: boolean) => void
}

const SIDEBAR_STORAGE_KEY = 'studyflow-sidebar-collapsed'

const getInitialCollapsed = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  isCollapsed: getInitialCollapsed(),
  toggleSidebar: () => {
    const next = !get().isCollapsed
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next))
    set({ isCollapsed: next })
  },
  setCollapsed: (collapsed) => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed))
    set({ isCollapsed: collapsed })
  },
}))

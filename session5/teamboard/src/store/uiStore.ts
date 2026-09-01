import { create } from "zustand";

export interface Toast {
  id: number;
  message: string;
  kind: "success" | "error" | "info";
}

interface UiState {
  /** Command palette (Ctrl+K) — opened from Header, Sidebar, anywhere */
  paletteOpen: boolean;
  togglePalette: () => void;
  closePalette: () => void;

  /** Sidebar collapse — Header toggles it, AppShell reads it */
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  /** Toast queue — fired from mutations anywhere in the app */
  toasts: Toast[];
  pushToast: (message: string, kind?: Toast["kind"]) => void;
  dismissToast: (id: number) => void;
}

let toastSeq = 0;

/**
 * ZUSTAND layer of the decision tree: UI state needed by *unrelated*
 * parts of the app (Header ↔ Palette ↔ Toasts ↔ Sidebar). Complex enough
 * (toast queue with auto-dismiss) to justify a real store, but note what
 * does NOT live here: server data, theme, selected task.
 */
export const useUiStore = create<UiState>((set) => ({
  paletteOpen: false,
  togglePalette: () => set((s) => ({ paletteOpen: !s.paletteOpen })),
  closePalette: () => set({ paletteOpen: false }),

  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  toasts: [],
  pushToast: (message, kind = "success") => {
    const id = ++toastSeq;
    set((s) => ({ toasts: [...s.toasts, { id, message, kind }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3500);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

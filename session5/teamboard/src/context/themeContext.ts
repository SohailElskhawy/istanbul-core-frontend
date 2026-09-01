import { createContext, useContext } from "react";

type Theme = "light" | "dark";

export interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
}

/**
 * CONTEXT layer of the state decision tree:
 * theme is needed by nearly every component in the tree (cards, panels,
 * palette, toasts...) — perfect Context use case. NOT a global store,
 * NOT server data.
 */
export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
    return ctx;
}

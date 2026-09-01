import { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./themeContext";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        const saved = localStorage.getItem("teamboard-theme");
        return saved === "dark" || saved === "light" ? saved : "dark";
    });

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("teamboard-theme", theme);
    }, [theme]);

    const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

    const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

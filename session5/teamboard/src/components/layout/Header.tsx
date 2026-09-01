import { Moon, Search, Sun } from "lucide-react";
import { useTheme } from "../../context/themeContext";
import { useCurrentUser } from "../../context/currentUserContext";
import { useUiStore } from "../../store/uiStore";
import { users } from "../../data/mockData";
import { Avatar } from "../Avatar";

interface HeaderProps {
    title: string;
}

export function Header({ title }: HeaderProps) {
    const { theme, toggleTheme } = useTheme();
    const { currentUser, setCurrentUser } = useCurrentUser();
    const { togglePalette } = useUiStore();

    return (
        <header className="header">
            <h1 className="header-title">{title}</h1>

            <button className="kbd-hint" onClick={togglePalette} style={{ marginLeft: "auto" }}>
                <Search size={15} />
                Search tasks & actions…
                <span className="kbd">Ctrl K</span>
            </button>

            {/* Mock "switch account" — shows Context in action */}
            <select
                className="select-sm"
                value={currentUser.id}
                onChange={(e) => setCurrentUser(users.find((u) => u.id === e.target.value)!)}
                title="Switch current user (mock auth)"
                aria-label="Current user"
            >
                {users.map((u) => (
                    <option key={u.id} value={u.id}>
                        {u.name}
                    </option>
                ))}
            </select>
            <Avatar user={currentUser} />

            <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
        </header>
    );
}

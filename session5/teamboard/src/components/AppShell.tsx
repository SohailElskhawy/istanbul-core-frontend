import { Sidebar } from "./layout/Sidebar";
import { Header } from "./layout/Header";
import { CommandPalette } from "./CommandPalette";
import { Toasts } from "./Toasts";

interface AppShellProps {
    title: string;
    currentBoardId: string | null;
    onOpenBoard: (boardId: string) => void;
    onGoHome: () => void;
    children: React.ReactNode;
}

export function AppShell({ title, currentBoardId, onOpenBoard, onGoHome, children }: AppShellProps) {
    return (
        <div className="app-shell">
            <Sidebar currentBoardId={currentBoardId} onOpenBoard={onOpenBoard} onGoHome={onGoHome} />

            <div className="main-area">
                <Header title={title} />
                {children}
            </div>

            {/* Global client-state features (Zustand) — mounted once, usable everywhere */}
            <CommandPalette onOpenBoard={onOpenBoard} />
            <Toasts />
        </div>
    );
}

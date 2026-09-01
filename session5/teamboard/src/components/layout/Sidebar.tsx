import { LayoutGrid, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useUiStore } from "../../store/uiStore";
import { useBoards } from "../../hooks/useBoard";

interface SidebarProps {
    currentBoardId: string | null;
    onOpenBoard: (boardId: string) => void;
    onGoHome: () => void;
}

export function Sidebar({ currentBoardId, onOpenBoard, onGoHome }: SidebarProps) {
    const { sidebarOpen, toggleSidebar } = useUiStore();
    const { data: boards } = useBoards();

    return (
        <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
            <button className="sidebar-item" onClick={toggleSidebar} title="Toggle sidebar">
                {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                {sidebarOpen && <span>TeamBoard</span>}
            </button>

            <div className="sidebar-label">{sidebarOpen ? "Boards" : "•"}</div>

            <button
                className={`sidebar-item ${currentBoardId === null ? "active" : ""}`}
                onClick={onGoHome}
                title="All boards"
            >
                <LayoutGrid size={18} />
                {sidebarOpen && <span>All Boards</span>}
            </button>

            {boards?.map((b) => (
                <button
                    key={b.id}
                    className={`sidebar-item ${currentBoardId === b.id ? "active" : ""}`}
                    onClick={() => onOpenBoard(b.id)}
                    title={b.name}
                >
                    <span>{b.emoji}</span>
                    {sidebarOpen && <span>{b.name}</span>}
                </button>
            ))}
        </aside>
    );
}

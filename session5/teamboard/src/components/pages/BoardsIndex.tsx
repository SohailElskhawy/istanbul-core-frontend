import { useBoards, useUsers } from "../../hooks/useBoard";
import { AvatarStack } from "../Avatar";

interface BoardsIndexProps {
    onOpenBoard: (boardId: string) => void;
}

export function BoardsIndex({ onOpenBoard }: BoardsIndexProps) {
    const { data: boards, isLoading } = useBoards();
    const { data: users } = useUsers();

    if (isLoading) return <div className="spinner" />;

    const usersById = new Map((users ?? []).map((u) => [u.id, u]));

    return (
        <div className="boards-page">
            <h2 className="page-title">All Boards</h2>
            <p className="page-subtitle">Pick a board to start planning. Drag cards between columns — updates are optimistic.</p>

            <div className="board-grid">
                {boards?.map((board) => (
                    <button key={board.id} className="board-card" onClick={() => onOpenBoard(board.id)}>
                        <span className="board-card-emoji">{board.emoji}</span>
                        <span className="board-card-name">{board.name}</span>
                        <span className="board-card-desc">{board.description}</span>
                        <span className="board-card-meta">
                            <AvatarStack members={board.memberIds.map((id) => usersById.get(id)!).filter(Boolean)} />
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

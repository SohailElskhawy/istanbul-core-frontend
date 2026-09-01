import { useState } from "react";
import type { ColumnId } from "../../types";
import { useBoardDetail, useUsers } from "../../hooks/useBoard";
import { KanbanBoard } from "../board/KanbanBoard";
import { TaskDetailPanel } from "../board/TaskDetailPanel";
import { NewTaskModal } from "../board/NewTaskModal";

interface BoardPageProps {
    boardId: string;
}

/**
 * LIFTED STATE layer: `selectedTaskId` lives here because BOTH the
 * Kanban grid (highlights the card) and the TaskDetailPanel (shows the
 * task) need it. Neither owns it alone.
 *
 * `newTaskColumn` (modal open + which column) is also lifted here since
 * the "Add task" buttons live deep inside each Column.
 */
export function BoardPage({ boardId }: BoardPageProps) {
    const { data: detail, isLoading, isError, error } = useBoardDetail(boardId);
    const { data: users } = useUsers();

    // ---- lifted state ----
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [newTaskColumn, setNewTaskColumn] = useState<ColumnId | null>(null);

    if (isLoading) return <div className="spinner" aria-label="Loading board" />;
    if (isError || !detail)
        return <div className="error-box">Failed to load board: {(error as Error)?.message ?? "unknown error"}</div>;

    const usersById = new Map((users ?? []).map((u) => [u.id, u]));
    const selectedTask = detail.tasks.find((t) => t.id === selectedTaskId) ?? null;

    return (
        <div className="board-page">
            <KanbanBoard
                detail={detail}
                usersById={usersById}
                selectedTaskId={selectedTaskId}
                onSelectTask={(id) => setSelectedTaskId(id === selectedTaskId ? null : id)}
                onAddTask={(col) => setNewTaskColumn(col)}
            />

            {selectedTask && (
                <TaskDetailPanel
                    detail={detail}
                    task={selectedTask}
                    onClose={() => setSelectedTaskId(null)}
                />
            )}

            {newTaskColumn && (
                <NewTaskModal
                    detail={detail}
                    initialColumn={newTaskColumn}
                    onClose={() => setNewTaskColumn(null)}
                />
            )}
        </div>
    );
}

import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import type { ColumnId, Task, User } from "../../types";
import { COLUMN_LABELS } from "../../api/client";
import { TaskCard } from "./TaskCard";

const COLUMN_COLORS: Record<ColumnId, string> = {
    todo: "#8b91a7",
    "in-progress": "#6366f1",
    review: "#f59e0b",
    done: "#10b981",
};

interface ColumnProps {
    columnId: ColumnId;
    tasks: Task[];
    usersById: Map<string, User>;
    selectedTaskId: string | null;
    onSelectTask: (taskId: string) => void;
    onAddTask: (columnId: ColumnId) => void;
}

export function Column({
    columnId,
    tasks,
    usersById,
    selectedTaskId,
    onSelectTask,
    onAddTask,
}: ColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id: `column-${columnId}` });

    return (
        <div className={`column ${isOver ? "drag-over" : ""}`} ref={setNodeRef}>
            <div className="column-header">
                <span className="column-dot" style={{ background: COLUMN_COLORS[columnId] }} />
                <span className="column-title">{COLUMN_LABELS[columnId]}</span>
                <span className="column-count">{tasks.length}</span>
            </div>

            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    assignee={task.assigneeId ? usersById.get(task.assigneeId) : undefined}
                    selected={selectedTaskId === task.id}
                    onClick={() => onSelectTask(task.id)}
                />
            ))}

            <button className="add-task-btn" onClick={() => onAddTask(columnId)}>
                <Plus size={15} />
                Add task
            </button>
        </div>
    );
}

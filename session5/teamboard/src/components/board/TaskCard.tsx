import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Calendar, Flag } from "lucide-react";
import type { Task, User } from "../../types";
import { Avatar } from "../Avatar";

interface TaskCardProps {
    task: Task;
    assignee: User | undefined;
    selected: boolean;
    onClick: () => void;
}

/**
 * LOCAL STATE layer: hover is pure presentation, only this card cares.
 * The `selected` flag comes from LIFTED state (BoardPage) because the
 * detail panel also needs it.
 */
export function TaskCard({ task, assignee, selected, onClick }: TaskCardProps) {
    const [hovered, setHovered] = useState(false);
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: task.id,
        data: { taskId: task.id, fromColumn: task.columnId },
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`task-card ${isDragging ? "dragging" : ""} ${selected ? "selected" : ""}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onClick}
            style={hovered && !isDragging ? { transform: "translateY(-1px)" } : undefined}
        >
            <div className="task-card-title">{task.title}</div>

            <div className="task-card-footer">
                {task.labels.slice(0, 2).map((label) => (
                    <span key={label} className="label-chip">
                        {label}
                    </span>
                ))}
                <span className={`priority-chip priority-${task.priority}`}>
                    <Flag size={11} />
                    {task.priority}
                </span>
                {task.dueDate && (
                    <span className="due-chip">
                        <Calendar size={11} />
                        {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                )}
                {assignee && <Avatar user={assignee} size={22} />}
            </div>
        </div>
    );
}

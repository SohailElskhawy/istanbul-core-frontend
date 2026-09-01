import { useMemo } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import type { BoardDetail, ColumnId, User } from "../../types";
import { COLUMN_ORDER } from "../../api/client";
import { useMoveTask } from "../../hooks/useBoard";
import { useUiStore } from "../../store/uiStore";
import { Column } from "./Column";

interface KanbanBoardProps {
    detail: BoardDetail;
    usersById: Map<string, User>;
    selectedTaskId: string | null;
    onSelectTask: (taskId: string) => void;
    onAddTask: (columnId: ColumnId) => void;
}

/**
 * DnD orchestration. The optimistic move mutation makes the card land
 * INSTANTLY in the new column, then reconciles with the fake server.
 */
export function KanbanBoard({ detail, usersById, selectedTaskId, onSelectTask, onAddTask }: KanbanBoardProps) {
    const moveTask = useMoveTask(detail.board.id);
    const pushToast = useUiStore((s) => s.pushToast);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

    const tasksByColumn = useMemo(() => {
        const map = new Map<ColumnId, BoardDetail["tasks"]>();
        for (const col of COLUMN_ORDER) {
            map.set(
                col,
                detail.tasks
                    .filter((t) => t.columnId === col)
                    .sort((a, b) => a.order - b.order),
            );
        }
        return map;
    }, [detail.tasks]);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over) return;

        const overId = String(over.id);
        const toColumn = (
            overId.startsWith("column-") ? overId.replace("column-", "") : detail.tasks.find((t) => t.id === overId)?.columnId
        ) as ColumnId | undefined;
        if (!toColumn) return;

        const taskId = String(active.id);
        const task = detail.tasks.find((t) => t.id === taskId);
        if (!task) return;

        // Compute target index: dropping onto a card inserts before it.
        const columnTasks = (tasksByColumn.get(toColumn) ?? []).filter((t) => t.id !== taskId);
        let toOrder: number;
        if (overId.startsWith("column-")) {
            toOrder = columnTasks.length;
        } else {
            const overIndex = columnTasks.findIndex((t) => t.id === overId);
            toOrder = overIndex === -1 ? columnTasks.length : overIndex;
        }

        if (task.columnId === toColumn && task.order === toOrder) return;

        moveTask.mutate(
            { taskId, toColumn, toOrder },
            {
                onSuccess: () => {
                    if (task.columnId !== toColumn) pushToast(`Moved "${task.title}" to ${toColumn.replace("-", " ")}`);
                },
                onError: () => pushToast("Failed to move task — reverted", "error"),
            },
        );
    }

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="kanban">
                {COLUMN_ORDER.map((col) => (
                    <Column
                        key={col}
                        columnId={col}
                        tasks={tasksByColumn.get(col) ?? []}
                        usersById={usersById}
                        selectedTaskId={selectedTaskId}
                        onSelectTask={onSelectTask}
                        onAddTask={onAddTask}
                    />
                ))}
            </div>
        </DndContext>
    );
}

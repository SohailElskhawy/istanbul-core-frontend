import type { Board, BoardDetail, ColumnId, Comment, Task, User } from "../types";
import { activity, boards, comments, tasks, users } from "../data/mockData";

/**
 * Fake async API. In-memory data + simulated network latency so
 * TanStack Query's caching, loading states and optimistic updates
 * behave exactly like they would against a real backend.
 */

const LATENCY = () => 250 + Math.random() * 350;

function delay<T>(value: T): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY()));
}

let idSeq = 1000;
const uid = (prefix: string) => `${prefix}${++idSeq}`;

// ---------- Reads ----------

export const api = {
    fetchBoards(): Promise<Board[]> {
        return delay([...boards]);
    },

    fetchUsers(): Promise<User[]> {
        return delay([...users]);
    },

    fetchBoardDetail(boardId: string): Promise<BoardDetail> {
        const board = boards.find((b) => b.id === boardId);
        if (!board) return Promise.reject(new Error(`Board ${boardId} not found`));
        return delay({
            board,
            tasks: tasks
                .filter((t) => t.boardId === boardId)
                .sort((a, b) => a.order - b.order)
                .map((t) => ({ ...t })),
            comments: comments.filter((c) => tasks.some((t) => t.id === c.taskId && t.boardId === boardId)),
            activity: activity.filter((a) => a.boardId === boardId),
        });
    },

    // ---------- Writes ----------

    createTask(input: Omit<Task, "id" | "order" | "createdAt">): Promise<Task> {
        const order = tasks.filter((t) => t.boardId === input.boardId && t.columnId === input.columnId).length;
        const task: Task = { ...input, id: uid("t"), order, createdAt: new Date().toISOString() };
        tasks.push(task);
        activity.unshift({
            id: uid("a"),
            boardId: task.boardId,
            actorId: task.assigneeId ?? users[0].id,
            action: "created",
            target: task.title,
            createdAt: new Date().toISOString(),
        });
        return delay(task);
    },

    updateTask(taskId: string, patch: Partial<Task>): Promise<Task> {
        const idx = tasks.findIndex((t) => t.id === taskId);
        if (idx === -1) return Promise.reject(new Error("Task not found"));
        tasks[idx] = { ...tasks[idx], ...patch };
        return delay({ ...tasks[idx] });
    },

    /** Move a task to another column (drag & drop). */
    moveTask(taskId: string, toColumn: ColumnId, toOrder: number): Promise<Task> {
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return Promise.reject(new Error("Task not found"));

        // Reorder within the in-memory list, like a real server would.
        const siblings = tasks
            .filter((t) => t.boardId === task.boardId && t.columnId === toColumn && t.id !== taskId)
            .sort((a, b) => a.order - b.order);
        siblings.splice(toOrder, 0, { ...task, columnId: toColumn });
        siblings.forEach((t, i) => {
            const original = tasks.find((x) => x.id === t.id);
            if (original) {
                original.columnId = toColumn;
                original.order = i;
            }
        });

        if (task.columnId !== toColumn) {
            activity.unshift({
                id: uid("a"),
                boardId: task.boardId,
                actorId: users[0].id,
                action: "moved",
                target: `${task.title} → ${COLUMN_LABELS[toColumn]}`,
                createdAt: new Date().toISOString(),
            });
        }
        return delay({ ...task, columnId: toColumn });
    },

    deleteTask(taskId: string): Promise<{ id: string }> {
        const idx = tasks.findIndex((t) => t.id === taskId);
        if (idx !== -1) tasks.splice(idx, 1);
        return delay({ id: taskId });
    },

    addComment(taskId: string, authorId: string, body: string): Promise<Comment> {
        const comment: Comment = {
            id: uid("c"),
            taskId,
            authorId,
            body,
            createdAt: new Date().toISOString(),
        };
        comments.push(comment);
        return delay(comment);
    },
};

export const COLUMN_LABELS: Record<ColumnId, string> = {
    todo: "To Do",
    "in-progress": "In Progress",
    review: "Review",
    done: "Done",
};

export const COLUMN_ORDER: ColumnId[] = ["todo", "in-progress", "review", "done"];

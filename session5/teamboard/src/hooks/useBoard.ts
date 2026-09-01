import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BoardDetail, ColumnId, Task } from "../types";
import { api } from "../api/client";

export const queryKeys = {
    boards: ["boards"] as const,
    users: ["users"] as const,
    board: (id: string) => ["board", id] as const,
};

// ---------- Reads ----------

export function useBoards() {
    return useQuery({ queryKey: queryKeys.boards, queryFn: api.fetchBoards });
}

export function useUsers() {
    return useQuery({ queryKey: queryKeys.users, queryFn: api.fetchUsers });
}

export function useBoardDetail(boardId: string) {
    return useQuery({
        queryKey: queryKeys.board(boardId),
        queryFn: () => api.fetchBoardDetail(boardId),
        enabled: !!boardId,
    });
}

// ---------- Mutations (with optimistic updates) ----------

/**
 * Optimistic update pattern:
 * 1. onMutate  — cancel in-flight refetches, snapshot cache, apply local change
 * 2. onError   — roll back to the snapshot
 * 3. onSettled — always re-sync with the "server"
 */
function useOptimisticBoardMutation<TVars>(
    boardId: string,
    mutationFn: (vars: TVars) => Promise<unknown>,
    optimistic: (detail: BoardDetail, vars: TVars) => BoardDetail,
) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn,
        onMutate: async (vars: TVars) => {
            await qc.cancelQueries({ queryKey: queryKeys.board(boardId) });
            const previous = qc.getQueryData<BoardDetail>(queryKeys.board(boardId));
            if (previous) qc.setQueryData<BoardDetail>(queryKeys.board(boardId), optimistic(previous, vars));
            return { previous };
        },
        onError: (_err, _vars, ctx) => {
            if (ctx?.previous) qc.setQueryData(queryKeys.board(boardId), ctx.previous);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: queryKeys.board(boardId) });
        },
    });
}

export function useCreateTask(boardId: string) {
    return useOptimisticBoardMutation<Omit<Task, "id" | "order" | "createdAt">>(
        boardId,
        api.createTask,
        (detail, vars) => ({
            ...detail,
            tasks: [
                ...detail.tasks,
                {
                    ...vars,
                    id: `optimistic-${Date.now()}`,
                    order: detail.tasks.filter((t) => t.columnId === vars.columnId).length,
                    createdAt: new Date().toISOString(),
                },
            ],
        }),
    );
}

export function useUpdateTask(boardId: string) {
    return useOptimisticBoardMutation<{ taskId: string; patch: Partial<Task> }>(
        boardId,
        ({ taskId, patch }) => api.updateTask(taskId, patch),
        (detail, { taskId, patch }) => ({
            ...detail,
            tasks: detail.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
        }),
    );
}

export function useMoveTask(boardId: string) {
    return useOptimisticBoardMutation<{ taskId: string; toColumn: ColumnId; toOrder: number }>(
        boardId,
        ({ taskId, toColumn, toOrder }) => api.moveTask(taskId, toColumn, toOrder),
        (detail, { taskId, toColumn, toOrder }) => {
            const task = detail.tasks.find((t) => t.id === taskId);
            if (!task) return detail;
            const others = detail.tasks.filter((t) => t.id !== taskId);
            const columnTasks = others
                .filter((t) => t.columnId === toColumn)
                .sort((a, b) => a.order - b.order);
            columnTasks.splice(toOrder, 0, { ...task, columnId: toColumn });
            const updated = columnTasks.map((t, i) => ({ ...t, order: i }));
            return {
                ...detail,
                tasks: [...others.filter((t) => t.columnId !== toColumn), ...updated],
            };
        },
    );
}

export function useDeleteTask(boardId: string) {
    return useOptimisticBoardMutation<string>(
        boardId,
        api.deleteTask,
        (detail, taskId) => ({ ...detail, tasks: detail.tasks.filter((t) => t.id !== taskId) }),
    );
}

export function useAddComment(boardId: string) {
    return useOptimisticBoardMutation<{ taskId: string; authorId: string; body: string }>(
        boardId,
        ({ taskId, authorId, body }) => api.addComment(taskId, authorId, body),
        (detail, { taskId, authorId, body }) => ({
            ...detail,
            comments: [
                ...detail.comments,
                {
                    id: `optimistic-${Date.now()}`,
                    taskId,
                    authorId,
                    body,
                    createdAt: new Date().toISOString(),
                },
            ],
        }),
    );
}

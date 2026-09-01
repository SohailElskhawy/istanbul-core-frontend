import { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";
import type { BoardDetail, Task } from "../../types";
import { COLUMN_LABELS, COLUMN_ORDER } from "../../api/client";
import { users as USERS } from "../../data/mockData";
import { useAddComment, useDeleteTask, useUpdateTask } from "../../hooks/useBoard";
import { useCurrentUser } from "../../context/currentUserContext";
import { useUiStore } from "../../store/uiStore";
import { Avatar } from "../Avatar";

interface TaskDetailPanelProps {
    detail: BoardDetail;
    task: Task;
    onClose: () => void;
}

/**
 * The panel receives `task` from LIFTED state in BoardPage.
 * Its own form fields are LOCAL state (drafts) — only committed to the
 * server via the optimistic update mutation.
 */
export function TaskDetailPanel({ detail, task, onClose }: TaskDetailPanelProps) {
    const { currentUser } = useCurrentUser();
    const pushToast = useUiStore((s) => s.pushToast);
    const updateTask = useUpdateTask(detail.board.id);
    const deleteTask = useDeleteTask(detail.board.id);
    const addComment = useAddComment(detail.board.id);

    // Local draft state — editing here doesn't hit the "server" until blur/save
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [commentDraft, setCommentDraft] = useState("");

    // Re-sync drafts when a DIFFERENT task is selected (adjust state during
    // render instead of an effect — avoids cascading renders)
    const [lastTaskId, setLastTaskId] = useState(task.id);
    if (lastTaskId !== task.id) {
        setLastTaskId(task.id);
        setTitle(task.title);
        setDescription(task.description);
    }

    // Close on Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);


    const taskComments = detail.comments
        .filter((c) => c.taskId === task.id)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    function commitField(patch: Partial<Task>) {
        updateTask.mutate(
            { taskId: task.id, patch },
            { onError: () => pushToast("Failed to save changes", "error") },
        );
    }

    function handleDelete() {
        deleteTask.mutate(task.id, {
            onSuccess: () => {
                pushToast(`Deleted "${task.title}"`);
                onClose();
            },
            onError: () => pushToast("Failed to delete task", "error"),
        });
    }

    function handleAddComment() {
        const body = commentDraft.trim();
        if (!body) return;
        setCommentDraft("");
        addComment.mutate(
            { taskId: task.id, authorId: currentUser.id, body },
            { onError: () => pushToast("Failed to post comment", "error") },
        );
    }

    return (
        <>
            <div className="detail-overlay" onClick={onClose} />
            <aside className="detail-panel" role="dialog" aria-label="Task details">
                <div className="detail-header">
                    <span className="label-chip">{COLUMN_LABELS[task.columnId]}</span>
                    <button className="icon-btn" onClick={onClose} style={{ marginLeft: "auto" }} title="Close (Esc)">
                        <X size={18} />
                    </button>
                </div>

                <div className="detail-body">
                    <div className="detail-field">
                        <label className="detail-section-title" htmlFor="task-title">Title</label>
                        <input
                            id="task-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={() => title.trim() && title !== task.title && commitField({ title: title.trim() })}
                        />
                    </div>

                    <div className="detail-field">
                        <label className="detail-section-title" htmlFor="task-desc">Description</label>
                        <textarea
                            id="task-desc"
                            className="textarea-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={() => description !== task.description && commitField({ description })}
                            placeholder="Add a description…"
                        />
                    </div>

                    <div className="detail-row">
                        <div className="detail-field">
                            <label className="detail-section-title" htmlFor="task-assignee">Assignee</label>
                            <select
                                id="task-assignee"
                                value={task.assigneeId ?? ""}
                                onChange={(e) => commitField({ assigneeId: e.target.value || null })}
                            >
                                <option value="">Unassigned</option>
                                {detail.board.memberIds.map((id) => {
                                    const u = USERS.find((x) => x.id === id);
                                    return u ? <option key={u.id} value={u.id}>{u.name}</option> : null;
                                })}
                            </select>
                        </div>

                        <div className="detail-field">
                            <label className="detail-section-title" htmlFor="task-column">Column</label>
                            <select
                                id="task-column"
                                value={task.columnId}
                                onChange={(e) => commitField({ columnId: e.target.value as Task["columnId"] })}
                            >
                                {COLUMN_ORDER.map((col) => (
                                    <option key={col} value={col}>{COLUMN_LABELS[col]}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="detail-row">
                        <div className="detail-field">
                            <label className="detail-section-title" htmlFor="task-priority">Priority</label>
                            <select
                                id="task-priority"
                                value={task.priority}
                                onChange={(e) => commitField({ priority: e.target.value as Task["priority"] })}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div className="detail-field">
                            <label className="detail-section-title" htmlFor="task-due">Due date</label>
                            <input
                                id="task-due"
                                type="date"
                                value={task.dueDate ?? ""}
                                onChange={(e) => commitField({ dueDate: e.target.value || null })}
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="detail-section-title">Comments ({taskComments.length})</h3>
                        {taskComments.map((c) => {
                            const author = USERS.find((u) => u.id === c.authorId);
                            return (
                                <div className="comment" key={c.id}>
                                    {author && <Avatar user={author} size={26} />}
                                    <div>
                                        <div className="comment-meta">
                                            <strong>{author?.name ?? "Unknown"}</strong>{" · "}
                                            {new Date(c.createdAt).toLocaleString(undefined, {
                                                month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                                            })}
                                        </div>
                                        <div className="comment-body">{c.body}</div>
                                    </div>
                                </div>
                            );
                        })}

                        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                            <input
                                value={commentDraft}
                                onChange={(e) => setCommentDraft(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                                placeholder={`Comment as ${currentUser.name}…`}
                            />
                            <button className="btn btn-primary" onClick={handleAddComment} disabled={!commentDraft.trim()}>
                                Post
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="detail-section-title">Activity</h3>
                        {detail.activity.slice(0, 5).map((a) => {
                            const actor = USERS.find((u) => u.id === a.actorId);
                            return (
                                <div className="activity-item" key={a.id}>
                                    <strong>{actor?.name ?? "Someone"}</strong>
                                    <span>{a.action}</span>
                                    <span>{a.target}</span>
                                </div>
                            );
                        })}
                    </div>

                    <button className="btn btn-danger" onClick={handleDelete} disabled={deleteTask.isPending}>
                        <Trash2 size={15} />
                        Delete task
                    </button>
                </div>
            </aside>
        </>
    );
}


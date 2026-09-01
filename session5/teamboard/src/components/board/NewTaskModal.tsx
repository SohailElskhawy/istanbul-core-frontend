import { useState } from "react";
import { X } from "lucide-react";
import type { BoardDetail, ColumnId } from "../../types";
import { COLUMN_LABELS, COLUMN_ORDER } from "../../api/client";
import { users as MEMBERS } from "../../data/mockData";
import { useCreateTask } from "../../hooks/useBoard";
import { useCurrentUser } from "../../context/currentUserContext";
import { useUiStore } from "../../store/uiStore";

interface NewTaskModalProps {
    detail: BoardDetail;
    initialColumn: ColumnId;
    onClose: () => void;
}

/**
 * Form state is 100% LOCAL (useState) — it dies with the modal.
 * On submit it goes through the optimistic mutation so the card
 * appears instantly on the board.
 */
export function NewTaskModal({ detail, initialColumn, onClose }: NewTaskModalProps) {
    const { currentUser } = useCurrentUser();
    const pushToast = useUiStore((s) => s.pushToast);
    const createTask = useCreateTask(detail.board.id);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [columnId, setColumnId] = useState<ColumnId>(initialColumn);
    const [assigneeId, setAssigneeId] = useState<string>(currentUser.id);
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
    const [dueDate, setDueDate] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) return;
        createTask.mutate(
            {
                boardId: detail.board.id,
                columnId,
                title: title.trim(),
                description: description.trim(),
                assigneeId: assigneeId || null,
                labels: [],
                priority,
                dueDate: dueDate || null,
            },
            {
                onSuccess: () => {
                    pushToast(`Created "${title.trim()}"`);
                    onClose();
                },
                onError: () => pushToast("Failed to create task", "error"),
            },
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
                <div className="modal-header">
                    New task
                    <button type="button" className="icon-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="detail-field">
                        <label className="detail-section-title" htmlFor="new-title">Title *</label>
                        <input
                            id="new-title"
                            autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                        />
                    </div>

                    <div className="detail-field">
                        <label className="detail-section-title" htmlFor="new-desc">Description</label>
                        <textarea
                            id="new-desc"
                            className="textarea-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add context, links, acceptance criteria…"
                        />
                    </div>

                    <div className="detail-row">
                        <div className="detail-field">
                            <label className="detail-section-title" htmlFor="new-column">Column</label>
                            <select id="new-column" value={columnId} onChange={(e) => setColumnId(e.target.value as ColumnId)}>
                                {COLUMN_ORDER.map((col) => (
                                    <option key={col} value={col}>{COLUMN_LABELS[col]}</option>
                                ))}
                            </select>
                        </div>

                        <div className="detail-field">
                            <label className="detail-section-title" htmlFor="new-assignee">Assignee</label>
                            <select id="new-assignee" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
                                <option value="">Unassigned</option>
                                {detail.board.memberIds.map((id) => {
                                    const u = MEMBERS.find((m) => m.id === id);
                                    return u ? <option key={u.id} value={u.id}>{u.name}</option> : null;
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="detail-row">
                        <div className="detail-field">
                            <label className="detail-section-title" htmlFor="new-priority">Priority</label>
                            <select id="new-priority" value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div className="detail-field">
                            <label className="detail-section-title" htmlFor="new-due">Due date</label>
                            <input id="new-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={!title.trim() || createTask.isPending}>
                        {createTask.isPending ? "Creating…" : "Create task"}
                    </button>
                </div>
            </form>
        </div>
    );
}

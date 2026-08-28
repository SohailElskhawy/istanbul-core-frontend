import React, { useState } from 'react';
import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newTitle: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.todo);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== task.todo) {
      onEdit(task.id, trimmed);
    } else {
      setEditTitle(task.todo);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.todo);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <li className={`task-item ${task.completed ? 'completed' : 'pending'}`}>
      {/* 1. Custom Checkbox */}
      <label className="task-checkbox-container">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark "${task.todo}" as ${task.completed ? 'pending' : 'completed'}`}
        />
        <span className="custom-checkmark" aria-hidden="true" />
      </label>

      {/* 2. Task Content / Inline Edit Form */}
      {isEditing ? (
        <form className="inline-edit-form" onSubmit={handleSave}>
          <input
            type="text"
            className="inline-edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            aria-label="Edit task title"
          />
          <button
            type="submit"
            className="icon-btn save-btn"
            title="Save changes (Enter)"
            aria-label="Save changes"
          >
            ✓
          </button>
          <button
            type="button"
            className="icon-btn cancel-btn"
            onClick={handleCancel}
            title="Cancel editing (Esc)"
            aria-label="Cancel editing"
          >
            ✕
          </button>
        </form>
      ) : (
        <div className="task-content">
          <span className={`task-title ${task.completed ? 'task-title-completed' : ''}`}>
            {task.todo}
          </span>
          <div className="task-metadata">
            {/* Priority Badge */}
            <span className={`badge-priority priority-${task.priority}`}>
              {task.priority === 'high' && '🔴 High'}
              {task.priority === 'medium' && '🟡 Med'}
              {task.priority === 'low' && '🟢 Low'}
            </span>

            {/* Created Timestamp */}
            {task.createdAt && (
              <span className="task-date">
                📅 {task.createdAt}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 3. Status Badge (Completed / Pending) */}
      {!isEditing && (
        <span className={`task-status-badge ${task.completed ? 'badge-completed' : 'badge-pending'}`}>
          {task.completed ? 'Completed' : 'Pending'}
        </span>
      )}

      {/* 4. Action Buttons (Edit & Delete) */}
      {!isEditing && (
        <div className="task-actions">
          <button
            type="button"
            className="icon-btn edit-btn"
            onClick={() => setIsEditing(true)}
            aria-label={`Edit task "${task.todo}"`}
            title="Edit task title"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>

          <button
            type="button"
            className="icon-btn delete-btn"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete task "${task.todo}"`}
            title="Delete task"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      )}
    </li>
  );
};
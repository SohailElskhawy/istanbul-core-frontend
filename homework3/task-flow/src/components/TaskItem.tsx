import React from 'react';
import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
}) => {
  return (
    <li className={`task-item ${task.completed ? 'completed' : 'pending'}`}>
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

      <span className={`task-title ${task.completed ? 'task-title-completed' : ''}`}>
        {task.todo}
      </span>

      <span className={`task-status-badge ${task.completed ? 'badge-completed' : 'badge-pending'}`}>
        {task.completed ? 'Completed' : 'Pending'}
      </span>

      <button
        type="button"
        className="delete-btn"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete task "${task.todo}"`}
        title="Delete task"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
        <span className="delete-text">Delete</span>
      </button>
    </li>
  );
};
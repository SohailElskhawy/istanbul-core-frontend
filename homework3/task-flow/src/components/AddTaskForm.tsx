import React, { useState } from 'react';
import type { PriorityLevel } from '../types/task';
import { PRIORITY_CONFIG } from '../constants/taskConfig';

interface AddTaskFormProps {
  onAddTask: (title: string, priority: PriorityLevel) => void;
}

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [inputError, setInputError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setInputError('Please enter a task title before adding.');
      return;
    }

    onAddTask(trimmedTitle, priority);
    setTitle('');
    setPriority('medium');
    setInputError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (inputError) {
      setInputError('');
    }
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as PriorityLevel;
    if (val in PRIORITY_CONFIG) {
      setPriority(val);
    }
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit} noValidate>
      <div className="input-group">
        <label htmlFor="new-task-input" className="sr-only">
          Task Title
        </label>
        <input
          id="new-task-input"
          type="text"
          className={`task-input ${inputError ? 'input-invalid' : ''}`}
          placeholder="What needs to be done?"
          value={title}
          onChange={handleInputChange}
          aria-label="New task title"
          aria-invalid={Boolean(inputError)}
          aria-describedby={inputError ? 'add-task-error' : undefined}
        />

        <label htmlFor="new-task-priority" className="sr-only">
          Task Priority
        </label>
        <select
          id="new-task-priority"
          className="priority-select"
          value={priority}
          onChange={handlePriorityChange}
          aria-label="Select task priority"
        >
          {(Object.keys(PRIORITY_CONFIG) as PriorityLevel[]).map((level) => (
            <option key={level} value={level}>
              {PRIORITY_CONFIG[level].displayText}
            </option>
          ))}
        </select>

        <button type="submit" className="add-btn" aria-label="Add task">
          <span aria-hidden="true">+</span> Add Task
        </button>
      </div>

      {inputError && (
        <p id="add-task-error" className="form-error-message" role="alert">
          {inputError}
        </p>
      )}
    </form>
  );
}
import React, { useState } from 'react';
import type { PriorityLevel } from '../types/task';

interface AddTaskFormProps {
  onAddTask: (title: string, priority: PriorityLevel) => void;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
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

  return (
    <form className="add-task-form" onSubmit={handleSubmit} noValidate>
      <div className="input-group">
        <input
          type="text"
          className={`task-input ${inputError ? 'input-invalid' : ''}`}
          placeholder="What needs to be done?"
          value={title}
          onChange={handleInputChange}
          aria-label="New task title"
        />

        <select
          className="priority-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value as PriorityLevel)}
          aria-label="Select task priority"
        >
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>

        <button type="submit" className="add-btn">
          <span>+</span> Add Task
        </button>
      </div>
      {inputError && <p className="form-error-message" role="alert">{inputError}</p>}
    </form>
  );
};
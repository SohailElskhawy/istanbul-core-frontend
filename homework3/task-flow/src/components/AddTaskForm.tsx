import React, { useState } from 'react';

interface AddTaskFormProps {
  onAddTask: (title: string) => void;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [inputError, setInputError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setInputError('Please enter a task title before adding.');
      return;
    }

    onAddTask(trimmedTitle);
    setTitle('');
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
        <button type="submit" className="add-btn">
          <span>+</span> Add Task
        </button>
      </div>
      {inputError && <p className="form-error-message" role="alert">{inputError}</p>}
    </form>
  );
};
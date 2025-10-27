import React, { useState } from 'react';
import './TaskEditForm.css'; 

const TaskEditForm = ({ task, onSave, onDelete, onCancel }) => {
  const [title, setTitle] = useState(task.title);
  const [act, setAct] = useState(task.actual);
  const [est, setEst] = useState(task.est);

  const handleSave = (e) => {
    e.preventDefault();
    onSave({ ...task, title, actual: Number(act), est: Number(est) });
  };
  
  const handleDelete = () => {
    onDelete(task.id);
  };

  return (
    <form className="task-edit-form" onSubmit={handleSave}>
      <input
        type="text"
        className="title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>Act / Est Pomodoros</label>
      <div className="pomodoro-inputs">
        <input
          type="number"
          value={act}
          onChange={(e) => setAct(e.target.value)}
          min="0"
        />
        <span> / </span>
        <input
          type="number"
          value={est}
          onChange={(e) => setEst(e.target.value)}
          min="1"
        />
      </div>
      <div className="form-links">
        <span>+ Add Note</span>
        <span>+ Add Project</span>
      </div>
      <div className="form-actions-primary">
        <button type="button" onClick={handleDelete} className="delete-button">
          🗑️
        </button>
        <div className="main-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="save-button">
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default TaskEditForm;
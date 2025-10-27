import React, { useState } from 'react';
import './Tasks.css';
import TaskEditForm from './TaskEditForm';

const Tasks = ({ tasks, onSaveTask, onSetActiveTask, activeTaskId, editingTaskId, onSetEditingTask, onUpdateTask, onDeleteTask, onCancelEdit }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [estPomodoros, setEstPomodoros] = useState(1);

  const handleSaveNewTask = (e) => {
    e.preventDefault();
    if (taskTitle.trim() === '') return;
    onSaveTask({ title: taskTitle.trim(), est: estPomodoros });
    setIsAdding(false);
    setTaskTitle('');
    setEstPomodoros(1);
  };

  return (
    <div className="tasks-wrapper">
      <div className="tasks-header">
        <h3>Tasks</h3>
        <button className="menu-button">⋮</button>
      </div>

      <div className="task-list">
        {tasks.map(task => (
          // === Logika Conditional Rendering ===
          editingTaskId === task.id ? (
            <TaskEditForm 
              key={task.id} 
              task={task} 
              onSave={onUpdateTask}
              onDelete={onDeleteTask}
              onCancel={onCancelEdit}
            />
          ) : (
            <div 
              key={task.id} 
              className={`task-item ${task.id === activeTaskId ? 'active' : ''}`}
              onClick={() => onSetActiveTask(task.id)}
            >
              <span className="task-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="check-icon"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                {task.title}
              </span>
              <div className="task-progress">
                <span>{task.actual}</span> / <span>{task.est}</span>
                <button 
                  className="task-menu-button"
                  onClick={(e) => { 
                    e.stopPropagation(); // Mencegah bubble event ke div .task-item
                    onSetEditingTask(task.id); 
                  }}
                >
                  ⋮
                </button>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Form untuk menambah task baru */}
      {isAdding && !editingTaskId && (
         <form className="add-task-form" onSubmit={handleSaveNewTask}>
          <input type="text" placeholder="What are you working on?" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} autoFocus />
          <label>Est Pomodoros</label>
          <div className="pomodoro-input-section"><input type="number" value={estPomodoros} onChange={(e) => setEstPomodoros(Number(e.target.value))} min="1" /></div>
          <div className="form-actions-primary">
            <button type="button" className="cancel-button" onClick={() => setIsAdding(false)}>Cancel</button>
            <button type="submit" className="save-button">Save</button>
          </div>
        </form>
      )}

      {/* Tombol Add Task */}
      {!isAdding && !editingTaskId && (
        <button className="add-task-button" onClick={() => setIsAdding(true)}>+ Add Task</button>
      )}
    </div>
  );
};

export default Tasks;
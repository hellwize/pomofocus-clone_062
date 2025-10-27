import React, { useState, useEffect, useMemo, useRef } from 'react';
import './App.css';
import Timer from './components/Timer';
import Tasks from './components/Tasks';
import alarmSoundFile from './assets/alarmPomo.wav'; 

const modeDurations = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

function App() {
  const [activeMode, setActiveMode] = useState('pomodoro');
  const [time, setTime] = useState(modeDurations.pomodoro);
  const [isActive, setIsActive] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const [tasks, setTasks] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null); 
  
  const audioRef = useRef(null);

  const handleSaveTask = (taskData) => {
    const newTask = { id: Date.now(), title: taskData.title, est: taskData.est, actual: 0, completed: false };
    setTasks([...tasks, newTask]);
    if (!activeTaskId) setActiveTaskId(newTask.id);
  };
  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setEditingTaskId(null);
  };
  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure?")) {
      setTasks(tasks.filter(task => task.id !== taskId));
      if (activeTaskId === taskId) setActiveTaskId(null);
      if (editingTaskId === taskId) setEditingTaskId(null);
    }
  };
  const handleSetEditingTask = (taskId) => setEditingTaskId(taskId);
  const handleCancelEdit = () => setEditingTaskId(null);

  const handleNextMode = () => {
    if (activeMode === 'pomodoro' && activeTaskId) {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      setTasks(tasks.map(task => task.id === activeTaskId ? { ...task, actual: task.actual + 1 } : task));
      changeMode(newCount % 4 === 0 ? 'longBreak' : 'shortBreak');
    } else {
      changeMode('pomodoro');
    }
  };

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => setTime(prev => prev - 1), 1000);
    } else if (time === 0 && isActive) {
      if (audioRef.current) audioRef.current.play();
      handleNextMode();
    }
    return () => clearInterval(interval);
  }, [isActive, time, activeTaskId, tasks]);
  
  const changeMode = (mode) => {
    setActiveMode(mode);
    setTime(modeDurations[mode]);
    setIsActive(false);
  };
  const toggleTimer = () => setIsActive(!isActive);
  const handleSkip = () => {
    if (window.confirm("Are you sure?")) handleNextMode();
  };
  const { totalPomos, finishAt, totalHours } = useMemo(() => {
    const totalEst = tasks.reduce((sum, task) => sum + task.est, 0);
    const totalActual = tasks.reduce((sum, task) => sum + task.actual, 0);
    if (totalEst === 0) return { totalPomos: "0 / 0", finishAt: "00:00", totalHours: "0.0" };
    const remainingPomos = totalEst - totalActual;
    const pomodorosToRun = Math.max(0, remainingPomos);
    const numLongBreaks = Math.floor(pomodorosToRun / 4);
    const numShortBreaks = pomodorosToRun - numLongBreaks;
    const totalSeconds = (pomodorosToRun * modeDurations.pomodoro) + (numShortBreaks * modeDurations.shortBreak) + (numLongBreaks * modeDurations.longBreak);
    const finishDate = new Date(Date.now() + totalSeconds * 1000);
    return {
      totalPomos: `${totalActual} / ${totalEst}`,
      finishAt: `${String(finishDate.getHours()).padStart(2, '0')}:${String(finishDate.getMinutes()).padStart(2, '0')}`,
      totalHours: (totalSeconds / 3600).toFixed(1),
    };
  }, [tasks]);

  const backgroundColor = activeMode === 'pomodoro' ? 'rgb(186, 73, 73)' : activeMode === 'shortBreak' ? 'rgb(56, 133, 138)' : 'rgb(57, 112, 151)';
  document.body.style.backgroundColor = backgroundColor;
  
  const activeTask = tasks.find(task => task.id === activeTaskId);

  return (
    <div className="app-container">
      <audio ref={audioRef} src={alarmSoundFile} preload="auto" />
      <header><h1>✔ Pomofocus</h1></header>
      <Timer time={time} activeMode={activeMode} changeMode={changeMode} toggleTimer={toggleTimer} isActive={isActive} buttonColor={backgroundColor} onSkip={handleSkip}/>
      <div className="status-message">
        <p>#{pomodoroCount + 1}</p>
        <p>{activeTask ? activeTask.title : 'Time to focus!'}</p>
      </div>
      <Tasks tasks={tasks} activeTaskId={activeTaskId} editingTaskId={editingTaskId} onSaveTask={handleSaveTask} onSetActiveTask={setActiveTaskId} onSetEditingTask={handleSetEditingTask} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} onCancelEdit={handleCancelEdit}/>
      <div className="app-footer">
        <span>Pomos: {totalPomos}</span>
        <span>Finish At: {finishAt} ({totalHours}h)</span>
      </div>
    </div>
  );
}

export default App;
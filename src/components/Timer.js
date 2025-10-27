import React from 'react';

// Terima 'onSkip' sebagai prop
const Timer = ({ time, activeMode, changeMode, toggleTimer, isActive, buttonColor, onSkip }) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="timer-card">
      <div className="mode-buttons">
        <button className={activeMode === 'pomodoro' ? 'active' : ''} onClick={() => changeMode('pomodoro')}>Pomodoro</button>
        <button className={activeMode === 'shortBreak' ? 'active' : ''} onClick={() => changeMode('shortBreak')}>Short Break</button>
        <button className={activeMode === 'longBreak' ? 'active' : ''} onClick={() => changeMode('longBreak')}>Long Break</button>
      </div>
      <div className="time-display">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="timer-controls">
        <button className="start-button" onClick={toggleTimer} style={{ color: buttonColor }}>
          {isActive ? 'PAUSE' : 'START'}
        </button>
        {/* Tampilkan tombol skip HANYA jika timer aktif */}
        {isActive && (
          <button className="skip-button" onClick={onSkip}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Timer;
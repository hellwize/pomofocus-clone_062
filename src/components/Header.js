import React from 'react';
import './Header.css'; 

function Header() {
  return (
    <header className="app-header">
      <h1>✔ Pomofocus</h1>
      <div className="header-buttons">
        <button>Report</button>
        <button>Setting</button>
        <button>Sign In</button>
      </div>
    </header>
  );
}

export default Header;
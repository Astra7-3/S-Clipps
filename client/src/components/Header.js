import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo-wrap">
          <span className="logo-text">S/Clipps</span>
          <span className="logo-tagline">Auto Video Clipper</span>
        </div>
        <nav className="header-nav">
          <span className="nav-badge">✂️ 3-min clips</span>
        </nav>
      </div>
    </header>
  );
}

export default Header;

import React from 'react';
import { useHistory } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const history = useHistory();

  return (
    <div className="landing-container">
      {/* Logo at the top */}
      <img
        src="/Images/minister.jpg"
        alt="Minister's Assistant Logo"
        className="landing-logo"
      />

      {/* Title below the logo */}
      <h1 className="landing-title">
        <span style={{ color: '#b666c4' }}>My</span> Assistant
      </h1>

      {/* Buttons section */}
      <div className="landing-buttons">
        <button
          className="btn"
          onClick={() => history.push('/login')}
        >
          Login
        </button>
        <button
          className="btn"
          onClick={() => history.push('/registration')}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default LandingPage;

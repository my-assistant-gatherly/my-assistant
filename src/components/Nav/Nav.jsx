import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';

function Nav() {
  const user = useSelector((store) => store.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropDown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="nav">
      {/* Logo and Title */}
      <div className="nav-logo-container">
        <Link to="/home">
          <img
            src="/Images/minister___s_assistant.jpg"
            alt="My Assistant Logo"
            className="nav-logo"
          />
        </Link>
        <Link to="/home">
          <h2 className="nav-title">My Assistant</h2>
        </Link>
      </div>

      {/* Links aligned to the right */}
      <div className="nav-links-container">
        <Link className="navLink" to="/home">
          Home
        </Link>
        <Link className="navLink" to="/calendar">
          Calendar
        </Link>
        {user.id && (
          <div className="dropdown">
            <button
              className="dropdown-trigger navLink"
              onClick={toggleDropDown}
            >
              Events ▼
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link className="dropdown-item" to="/my-events">
                  My Events
                </Link>
                <Link className="dropdown-item" to="/view-events">
                  View Events
                </Link>
                <Link className="dropdown-item" to="/create-events">
                  Create Events
                </Link>
              </div>
            )}
          </div>
        )}
        <Link className="navLink" to="/about">
          About
        </Link>
        {user.id && (
          <LogOutButton className="navLink logout-button" />
        )}
      </div>
    </div>
  );
}

export default Nav;

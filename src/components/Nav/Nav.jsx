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
      <Link to="/home">
        <h2 className="nav-title">My Assistant</h2>
      </Link>
      <div>
        {/* If no user is logged in, show these links */}
        {!user.id && (
          <Link className="navLink" to="/login">
            Login / Register
          </Link>
        )}

        {/* If a user is logged in, show these links */}
        {user.id && (
          <>
            <Link className="navLink" to="/user">
              Home
            </Link>

            <Link className="navLink" to="/calendar">
              Calendar
            </Link>

            {/* Dropdown for Events */}
            <span
              className="navLink dropdown-trigger"
              onClick={toggleDropDown}
            >
              Events
            </span>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link className="navLink dropdown-item" to="/my-events">
                  My Events
                </Link>
                <Link className="navLink dropdown-item" to="/view-events">
                  View Events
                </Link>
                <Link className="navLink dropdown-item" to="/create-events">
                  Create Events
                </Link>
              </div>
            )}

            <LogOutButton className="navLink" />
          </>
        )}

        <Link className="navLink" to="/about">
          About
        </Link>
      </div>
    </div>
  );
}

export default Nav;

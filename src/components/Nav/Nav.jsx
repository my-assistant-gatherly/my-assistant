import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';
import { Button, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function Nav() {
  const user = useSelector((store) => store.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState('Events');
  const open = Boolean(anchorEl);
  const location = useLocation();

  useEffect(() => {
    handleClose();
  }, [location]);

  useEffect(() => {
    handleClose();
    if (!location.pathname.includes('events')) {
      setSelectedEvent('Events');
    }
  }, [location]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '0 20px'
      }}>
        <Link to="/home">
          <h2 className="nav-title">My Assistant</h2>
        </Link>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          {!user.id && (
            <Link className="navLink" to="/login">
              Login / Register
            </Link>
          )}

          {user.id && (
            <>
              <Link className="navLink" to="/user">
                Home
              </Link>
              <Link className="navLink" to="/user-profile">
                Profile
                </Link>

              <Link className="navLink" to="/calendar">
                Calendar
              </Link>

              <div>
                <Button
                  id="events-button"
                  aria-controls={open ? 'events-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{
                    color: 'inherit',
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  {selectedEvent}
                </Button>
                <Menu
                  id="events-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'events-button',
                  }}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      setSelectedEvent('My Events');
                      handleClose();
                    }}
                    component={Link}
                    to="/my-events"
                  >
                    My Events
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setSelectedEvent('View Events');
                      handleClose();
                    }}
                    component={Link}
                    to="/view-events"
                  >
                    View Events
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setSelectedEvent('Create Events');
                      handleClose();
                    }}
                    component={Link}
                    to="/create-events"
                  >
                    Create Events
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setSelectedEvent(' Edit Events');
                      handleClose();
                    }}
                    component={Link}
                    to="/edit-events"
                  >
                    Edit Events
                  </MenuItem>
                </Menu>
              </div>

              <LogOutButton className="navLink"/>
            </>
          )}

          <Link className="navLink" to="/about">
            About
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Nav;

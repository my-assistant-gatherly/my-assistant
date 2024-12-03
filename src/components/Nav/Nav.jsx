import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';
import { Button, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function Nav() {
  const user = useSelector((store) => store.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="nav">
      {/* Logo and Title */}
      <Link to="/home">
        <h2 className="nav-title">My Assistant</h2>
      </Link>

      {/* Navigation Links */}
      <div className="nav-links-container">
        {!user.id ? (
          <Link className="navLink" to="/login">
            Login / Register
          </Link>
        ) : (
          <>
            <Link className="navLink" to="/user">
              Home
            </Link>
            <Link className="navLink" to="/calendar">
              Calendar
            </Link>
            <Button
              className="navLink"
              id="events-button"
              aria-controls={open ? 'events-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleMenuOpen}
              endIcon={<KeyboardArrowDownIcon />}
            >
              Events
            </Button>
            <Menu
              id="events-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'events-button',
              }}
            >
              <MenuItem onClick={handleMenuClose}>
                <Link className="dropdown-item" to="/my-events">
                  My Events
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link className="dropdown-item" to="/view-events">
                  View Events
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link className="dropdown-item" to="/create-events">
                  Create Events
                </Link>
              </MenuItem>
            </Menu>
            <LogOutButton className="navLink logout-button" />
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

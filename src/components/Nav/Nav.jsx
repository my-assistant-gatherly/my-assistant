import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';
import { Button, Menu, MenuItem, Avatar } from '@mui/material';
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

              <Link className="navLink" to="/calendar">
                Calendar
              </Link>

              <Link className="navLink" to="/events">
                Events
              </Link>

              <LogOutButton className="navLink"/>
            </>
          )}

          <Link className="navLink" to="/about">
            About
          </Link>

          {user.id && (
            <Link className="navLink profile-link" to="/user-profile">
              {user.image_url ? (
                <Avatar 
                  src={user.image_url} 
                  alt={user.username}
                  sx={{ 
                    width: 40, 
                    height: 40,
                    border: '2px solid white',
                    '&:hover': {
                      border: '2px solid #f2f2f2',
                      transform: 'scale(1.05)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                />
              ) : (
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40,
                    bgcolor: '#f2f2f2',
                    color: 'blue',
                    border: '2px solid white',
                    '&:hover': {
                      border: '2px solid #f2f2f2',
                      transform: 'scale(1.05)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  {user.username ? user.username[0].toUpperCase() : 'U'}
                </Avatar>
              )}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;

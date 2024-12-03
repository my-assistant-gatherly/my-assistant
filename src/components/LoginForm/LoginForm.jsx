import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import './Login.css';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  const login = (event) => {
    event.preventDefault();

    if (username && password) {
      dispatch({
        type: 'LOGIN',
        payload: {
          username: username,
          password: password,
        },
      });
    } else {
      dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  };

  return (
    <Box
      component="form"
      className="formPanel"
      onSubmit={login}
      noValidate
      sx={{ mt: 1 }}
    >
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      {errors.loginMessage && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {errors.loginMessage}
        </Alert>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#d8b4e2', // Light purple border
            },
            '&:hover fieldset': {
              borderColor: '#caa0d9', // Darker purple on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#b666c4', // Strong purple when focused
            },
          },
          '& .MuiInputBase-input': {
            backgroundColor: '#f3e6f7', // Light purple background
            color: '#333', // Dark text for contrast
          },
          '& .MuiInputLabel-root': {
            color: '#b666c4', // Purple label
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#b666c4', // Purple label when focused
          },
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#d8b4e2', // Light purple border
            },
            '&:hover fieldset': {
              borderColor: '#caa0d9', // Darker purple on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#b666c4', // Strong purple when focused
            },
          },
          '& .MuiInputBase-input': {
            backgroundColor: '#f3e6f7', // Light purple background
            color: '#333', // Dark text for contrast
          },
          '& .MuiInputLabel-root': {
            color: '#b666c4', // Purple label
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#b666c4', // Purple label when focused
          },
        }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          mt: 3,
          mb: 2,
          backgroundColor: '#b666c4', // Purple button
          '&:hover': {
            backgroundColor: '#9c4fab', // Darker purple on hover
          },
        }}
      >
        Log In
      </Button>
    </Box>
  );
}

export default LoginForm;

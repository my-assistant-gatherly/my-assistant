import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import './Login.css';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector(store => store.errors);
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
    <Box component="form" className="formPanel" onSubmit={login} noValidate sx={{ mt: 1 }}>
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
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Log In
      </Button>
    </Box>
  );
}

export default LoginForm;
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Typography, Box } from '@mui/material';
import './RegisterForm.css';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [user_title, setUser_title] = useState('');
  const [skill, setSkill] = useState('');
  const [zipcode, setZipcode] = useState('');
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  const registerUser = (event) => {
    event.preventDefault();

    dispatch({
      type: 'REGISTER',
      payload: {
        username: username,
        password: password,
        fullname: fullname,
        user_title: user_title,
        skill: skill,
        zipcode: zipcode,
      },
    });
  };

  return (
    <Box component="form" className="formPanel" onSubmit={registerUser} noValidate autoComplete="off">
      <img className="logo" src="/public/images/gatherly.png" alt="logo" />
      <Typography variant="h4" component="h2" gutterBottom className="register-form-title">
        Join <span>My-Assistant</span>
      </Typography>
      {errors.registrationMessage && (
        <Typography variant="body2" color="error" role="alert">
          {errors.registrationMessage}
        </Typography>
      )}
      <TextField
        fullWidth
        autoFocus
        margin="normal"
        label="Username"
        variant="outlined"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Full Name"
        variant="outlined"
        value={fullname}
        onChange={(event) => setFullname(event.target.value)}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Title"
        variant="outlined"
        value={user_title}
        onChange={(event) => setUser_title(event.target.value)}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Skill"
        variant="outlined"
        value={skill}
        onChange={(event) => setSkill(event.target.value)}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Zipcode"
        type="number"
        variant="outlined"
        value={zipcode}
        onChange={(event) => setZipcode(event.target.value)}
        required
      />
      <Button className="btn" type="submit" variant="contained" color="primary">
          Register
      </Button>
    </Box>
  );
}

export default RegisterForm;

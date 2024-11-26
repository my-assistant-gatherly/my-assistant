import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
  }; // end registerUser

  return (
    <form className="formPanel" onSubmit={registerUser}>
      <h2>Register User</h2>
      {errors.registrationMessage && (
        <h3 className="alert" role="alert">
          {errors.registrationMessage}
        </h3>
      )}
      <div>
        <label htmlFor="username">
          Username:
          <input
            type="text"
            name="username"
            value={username}
            required
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
      </div>
      <div>
        <label htmlFor="password">
          Password:
          <input
            type="password"
            name="password"
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
      </div>
      <div>
        <label htmlFor="fullname ">
          Name:
          <input
            type="text"
            name="fullname"
            value={fullname}
            required
            onChange={(event) => setFullname(event.target.value)}
          />
        </label>
      </div>
      <div>
        <label htmlFor="user_title">
          Title:
          <input
            type="text"
            name="user_title"
            value={user_title}
            required
            onChange={(event) => setUser_title(event.target.value)}
          />
        </label>
      </div>
      <div>
        <label htmlFor="skill">
          Skill:
          <input
            type="text"
            name="skill"
            value={skill}
            required
            onChange={(event) => setSkill(event.target.value)}
          />
        </label>
      </div>
      <div>
        <label htmlFor="zipcode">
          Zipcode:
          <input
            type="number"
            name="zipcode"
            value={zipcode}
            required
            onChange={(event) => setZipcode(event.target.value)}
          />
        </label>
      </div>
      <div>
        <input className="btn" type="submit" name="submit" value="Register" />
      </div>
    </form>
  );
}

export default RegisterForm;

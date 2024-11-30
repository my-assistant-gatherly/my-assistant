import React from 'react';
import { useHistory } from 'react-router-dom';
import RegisterForm from '../RegisterForm/RegisterForm';
import './RegistrationPage.css';

function RegisterPage() {
  const history = useHistory();

  return (
    <div className="registration-page">
      <RegisterForm />

      <center>
        <button
          type="button"
          className="btn btn_asLink registration-page-login-button"
          onClick={() => {
            history.push('/login');
          }}
        >
          Login
        </button>
      </center>
    </div>
  );
}

export default RegisterPage;

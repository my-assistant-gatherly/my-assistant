import React from 'react';
import LoginForm from '../LoginForm/LoginForm';
import { useHistory } from 'react-router-dom';
import './LoginPage.css';
function LoginPage() {
  const history = useHistory();

  return (
    // TODO: Add logo
    // <img src="" alt="" />
    <div className="login-page">
      <LoginForm />
      <p>Don't have an account? <br />
      <br />
      <button
          type="button"
          className="btn btn_asLink"
          onClick={() => {
            history.push('/registration');
          }}
        >
          Register
        </button>
      </p>

    </div>
  );
}

export default LoginPage;

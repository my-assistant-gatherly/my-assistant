import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LandingPage.css';

// CUSTOM COMPONENTS
import LoginPage from '../LoginPage/LoginPage';

function LandingPage() {
  const [heading, setHeading] = useState('Welcome');
  const history = useHistory();

  const onLogin = (event) => {
    history.push('/login');
  };

  return (
    <div className="container">

      <div className="flex">
        
       <img src="/public/images/minister.jpg" alt="logo" />
        <div className="flex-col">
         <LoginPage />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

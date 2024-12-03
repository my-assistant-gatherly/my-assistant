import React, { useEffect } from 'react';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

import AboutPage from '../AboutPage/AboutPage';
import UserPage from '../UserPage/UserPage';
import UserProfile from '../UserProfile/UserProfile';
import CreateEventsPage from '../CreateEvents/CreateEvents';
import ViewEvents from '../ViewEvents/ViewEvents';
import MyEvents from '../MyEvents/MyEvents';
import LandingPage from '../LandingPage/LandingPage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';
import BigCalendar from '../BigCalendar/BigCalendar';
import EditEvents from '../EditEvents/EditEvents';

import './App.css';

function App() {
  const dispatch = useDispatch();

  const user = useSelector(store => store.user);

  useEffect(() => {
    dispatch({ type: 'FETCH_USER' });
  }, [dispatch]);

  return (
    <Router>
      <div>
        {/* Conditionally render the Nav component */}
        {user.id && <Nav />}

        <Switch>
          {/* Redirect root path to /home */}
          <Redirect exact from="/" to="/home" />

          {/* Public route for AboutPage */}
          <Route exact path="/about">
            <AboutPage />
          </Route>

          {/* Protected Routes */}
          <ProtectedRoute exact path="/user">
            <UserPage />
          </ProtectedRoute>

          <ProtectedRoute exact path="/create-events">
            <CreateEventsPage />
          </ProtectedRoute>

          <ProtectedRoute exact path="/view-events">
            <ViewEvents />
          </ProtectedRoute>

          <ProtectedRoute exact path="/my-events">
            <MyEvents />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows EditEvents else shows LoginPage
            exact
            path="/edit-events"
          >
            <EditEvents/>

          </ProtectedRoute>
          <ProtectedRoute
       // logged in shows UserProfile else shows LoginPage
        exact
         path="/user-profile"
>
  <     UserProfile />
      </ProtectedRoute>

          <ProtectedRoute exact path="/edit-events"
          >
            <EditEvents/>

          </ProtectedRoute>
          <ProtectedRoute
       // logged in shows UserProfile else shows LoginPage
        exact
         path="/user-profile"
>
  <     UserProfile />
      </ProtectedRoute>

          <ProtectedRoute exact path="/calendar">
            <BigCalendar />
          </ProtectedRoute>

          {/* Public Routes */}
          <Route exact path="/login">
            {user.id ? <Redirect to="/user" /> : <LoginPage />}
          </Route>

          <Route exact path="/registration">
            {user.id ? <Redirect to="/user" /> : <RegisterPage />}
          </Route>

          <Route exact path="/home">
            {user.id ? <Redirect to="/user" /> : <LandingPage />}
          </Route>

          {/* 404 Page */}
          <Route>
            <h1>404</h1>
          </Route>
        </Switch>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;

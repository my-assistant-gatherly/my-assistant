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
import HomePage from '../HomePage/HomePage';
import UserProfile from '../UserProfile/UserProfile';
import CreateEventsPage from '../CreateEvents/CreateEvents';
import ViewEvents from '../ViewEvents/ViewEvents';
import MyEvents from '../MyEvents/MyEvents';
import LandingPage from '../LandingPage/LandingPage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';
import BigCalendar from '../BigCalendar/BigCalendar';
import EventDetails from '../EventDetails/EventDetails';

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
        <Nav />
        <Switch>
          {/* Visiting localhost:5173 will redirect to localhost:5173/home */}
          <Redirect exact from="/" to="/home" />

          {/* Visiting localhost:5173/about will show the about page. */}
          <Route
            // shows AboutPage at all times (logged in or not)
            exact
            path="/about"
          >
            <AboutPage />
          </Route>

          {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:5173/user will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:5173/user */}
          <ProtectedRoute
            // logged in shows HomePage else shows LoginPage
            exact
            path="/user"
          >
            <HomePage />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows CreateEventsPage else shows LoginPage
            exact
            path="/create-events"
          >
            <CreateEventsPage />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows ViewEventsPage else shows LoginPage
            exact
            path="/events"
          >
            <ViewEvents />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows MyEventsPage else shows LoginPage
            exact
            path="/my-events"
          >
            <MyEvents />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows EventDetails else shows LoginPage
            exact
            path="/event/:id"
          >
            <EventDetails />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows UserProfile else shows LoginPage
            exact
            path="/user-profile"
          >
            <UserProfile />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows CreateEventsPage else shows LoginPage
            exact
            path="/calendar"
          >
            <BigCalendar />
          </ProtectedRoute>

          <Route
            exact
            path="/login"
          >
            {user.id ?
              // If the user is already logged in, 
              // redirect to the /user page
              <Redirect to="/user" />
              :
              // Otherwise, show the login page
              <LoginPage />
            }
          </Route>

          <Route
            exact
            path="/registration"
          >
            {user.id ?
              // If the user is already logged in, 
              // redirect them to the /user page
              <Redirect to="/user" />
              :
              // Otherwise, show the registration page
              <RegisterPage />
            }
          </Route>

          <Route
            exact
            path="/home"
          >
            {user.id ?
              // If the user is already logged in, 
              // redirect them to the /user page
              <Redirect to="/user" />
              :
              // Otherwise, show the Landing page
              <LandingPage />
            }
          </Route>

          {/* If none of the other routes matched, we will show a 404. */}
          <Route>
            <h1>404</h1>
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

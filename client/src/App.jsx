import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import BookingsPage from './pages/BookingsPage';
import EventsPage from './pages/EventsPage';

import './App.css';
import MainNavigation from './components/navigation/MainNavigation';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <>
          <MainNavigation />
          <main className="main-content">
            <Switch>
              <Redirect from="/" to="/login" exact />
              <Route path="/login" component={LoginPage} />
              <Route path="/events" component={EventsPage} />
              <Route path="/bookings" component={BookingsPage} />
            </Switch>
          </main>
        </>
      </BrowserRouter>
    );
  }
}

export default App;

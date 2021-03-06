import React from 'react';
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';

const MainNavigation = props => {
  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>EasyEvents</h1>
      </div>
      <nav className="main-navigation__items">
        <ul>
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          <li>
            <NavLink to="/bookings">Bookings</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;

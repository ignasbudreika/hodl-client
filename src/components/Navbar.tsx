import React from 'react'
import { NavLink } from 'react-router-dom'
import { selectAuth, useAppSelector } from '../store';
import jwt from 'jwt-decode'

export const Navbar: React.FC = () => {
  const auth = useAppSelector(selectAuth);

  return <nav>
    <div className="nav-wrapper grey darken-1 px1">
      <NavLink to="/" className="left brand-logo">
        HODL
      </NavLink>
      <ul className="right hide-on-med-and-down">
        <li>
          <NavLink to="/published">People invest in</NavLink>
        </li>
        {auth.accessToken && (jwt((auth.accessToken)) as any).roles.includes('ROLE_USER') ? 
              <>
                <li>
                  <NavLink to="/portfolios">Portfolios</NavLink>
                </li>
                <li>
                  <NavLink to="/brokers">Brokers</NavLink>
                </li>
                <li>
                  <NavLink to="/investments">Investments</NavLink>
                </li>
                <li>
                  <NavLink to="/logout">Logout</NavLink>
                </li>
              </> : auth.accessToken && (jwt((auth.accessToken)) as any).roles.includes('ROLE_ADMIN') ? 
              <>
                <li>
                  <NavLink to="/approved">Approved</NavLink>
                </li>
                <li>
                  <NavLink to="/waiting-approval">Waiting approval</NavLink>
                </li>
                <li>
                  <NavLink to="/logout">Logout</NavLink>
                </li>
              </> :
              <>
                <li cy-data="home-nav-link">
                  <a href="http://localhost:8080/api/oauth2/authorize?response_type=code&client_id=hodl-client&scope=investments&redirect_uri=http://127.0.0.1:3000">Log in</a>
                </li>
                <li>
                  <NavLink to="/register">Sign up</NavLink>
                </li>
              </>
            }
      </ul>
    </div>
  </nav>
}

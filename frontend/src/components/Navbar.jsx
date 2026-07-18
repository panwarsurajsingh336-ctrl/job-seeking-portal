import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/hirevyom-logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath =
    user?.role === 'admin'
      ? '/admin'
      : user?.role === 'employer'
      ? '/employer'
      : '/seeker';

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <span className="logo-mark"><img src={logo} alt="" /></span>
        <span className="logo-word">Hire<span>Vyom</span></span>
      </Link>

      <nav className="nav-links">
        <NavLink to="/jobs">Jobs</NavLink>
        {user && <NavLink to={dashboardPath}>Dashboard</NavLink>}
        {!user ? (
          <>
            <NavLink to="/login">Login</NavLink>
            <Link to="/register" className="btn btn-small">Join Now</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="btn btn-small btn-dark">Logout</button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

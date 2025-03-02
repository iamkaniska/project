import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './navbar.css'

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  const authLinks = (
    <ul>
      <li>
        <Link to="/dashboard">Dashboard</Link>
      </li>
      <li>
        <Link to="/questions">Questions</Link>
      </li>
      <li>
        <Link to="/interviews">Interviews</Link>
      </li>
      {user && (user.role === 'recruiter' || user.role === 'admin') && (
        <li>
          <Link to="/create-interview">Create Interview</Link>
        </li>
      )}
      {user && user.role === 'admin' && (
        <li>
          <Link to="/admin">Admin Panel</Link>
        </li>
      )}
      <li>
        <Link to="/profile">Profile</Link>
      </li>
      <li>
        <a onClick={onLogout} href="#!">
          <i className="fas fa-sign-out-alt"></i>{' '}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> InterviewPrep
        </Link>
      </h1>
      <div>{isAuthenticated ? authLinks : guestLinks}</div>
    </nav>
  );
};

export default Navbar;
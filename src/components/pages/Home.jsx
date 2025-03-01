import { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Interview Preparation Platform</h1>
          <p className="lead">
            Prepare for your next interview with AI-generated questions, practice sessions, and feedback from recruiters
          </p>
          <div className="buttons">
            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
            <Link to="/login" className="btn btn-light">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
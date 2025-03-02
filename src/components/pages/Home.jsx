import { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Ace Your Next Interview</h1>
          <p className="hero-subtitle">
            Get AI-generated questions, practice sessions, and feedback from recruiters.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
            <Link to="/login" className="btn btn-outline">Login</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <h3>AI-Generated Questions</h3>
          <p>Practice with personalized interview questions tailored for your role.</p>
        </div>
        <div className="feature-card">
          <h3>Mock Interviews</h3>
          <p>Simulate real interview scenarios with recruiter feedback.</p>
        </div>
        <div className="feature-card">
          <h3>Performance Tracking</h3>
          <p>Analyze your progress and improve your interview skills over time.</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Get Started?</h2>
        <p>Sign up now and start preparing for your dream job.</p>
        <Link to="/register" className="btn btn-primary">Join Now</Link>
      </section>
    </div>
  );
};

export default Home;

import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import AlertContext from '../../context/AlertContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/interviews');
        setInterviews(res.data);
        setLoading(false);
      } catch (err) {
        setAlert('Error fetching interviews', 'danger');
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [setAlert]);

  return (
    <section className="container">
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome {user && user.name}
      </p>
      
      {user && user.role === 'jobseeker' && (
        <div className="dash-buttons">
          <Link to="/profile" className="btn btn-light">
            <i className="fas fa-user-circle text-primary"></i> My Profile
          </Link>
          <Link to="/generate-questions" className="btn btn-light">
            <i className="fas fa-question-circle text-primary"></i> Generate Practice Questions
          </Link>
        </div>
      )}
      
      {user && user.role === 'recruiter' && (
        <div className="dash-buttons">
          <Link to="/create-interview" className="btn btn-light">
            <i className="fas fa-plus text-primary"></i> Create Interview
          </Link>
          <Link to="/questions" className="btn btn-light">
            <i className="fas fa-question-circle text-primary"></i> Manage Questions
          </Link>
        </div>
      )}
      
      {user && user.role === 'admin' && (
        <div className="dash-buttons">
          <Link to="/admin" className="btn btn-light">
            <i className="fas fa-cog text-primary"></i> Admin Panel
          </Link>
        </div>
      )}
      
      <h2 className="my-2">Your Interviews</h2>
      
      {loading ? (
        <p>Loading...</p>
      ) : interviews.length > 0 ? (
        <div className="interviews">
          {interviews.map(interview => (
            <div key={interview._id} className="card">
              <h3>{interview.title}</h3>
              <p>Job Role: {interview.jobRole}</p>
              <p>Status: {interview.status}</p>
              {interview.scheduledDate && (
                <p>Scheduled: {new Date(interview.scheduledDate).toLocaleString()}</p>
              )}
              <Link to={`/interviews/${interview._id}`} className="btn btn-primary">
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No interviews found</p>
      )}
    </section>
  );
};

export default Dashboard;
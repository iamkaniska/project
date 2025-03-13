import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import AlertContext from '../../context/AlertContext';

const Interviews = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await axios.get('https://interview-prepare.onrender.com/api/interviews');
        setInterviews(res.data);
        setLoading(false);
      } catch (err) {
        setAlert('Error fetching interviews', 'danger');
        setLoading(false);
      }
    };
    
    fetchInterviews();
  }, [setAlert]);
  
  const deleteInterview = async (id) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      try {
        await axios.delete(`https://interview-prepare.onrender.com/api/interviews/${id}`);
        setInterviews(interviews.filter(interview => interview._id !== id));
        setAlert('Interview removed', 'success');
      } catch (err) {
        setAlert('Error deleting interview', 'danger');
      }
    }
  };
  
  return (
    <section className="container">
      <h1 className="large text-primary">Interviews</h1>
      <p className="lead">
        <i className="fas fa-user-tie"></i> Manage your interviews
      </p>
      
      {(user.role === 'recruiter' || user.role === 'admin') && (
        <div className="dash-buttons">
          <Link to="/create-interview" className="btn btn-primary">
            <i className="fas fa-plus"></i> Create New Interview
          </Link>
        </div>
      )}
      
      {loading ? (
        <div>Loading...</div>
      ) : interviews.length > 0 ? (
        <div className="interviews">
          {interviews.map(interview => (
            <div key={interview._id} className="card">
              <div className="interview-header">
                <h3>{interview.title}</h3>
                <span className={`badge badge-${
                  interview.status === 'draft' ? 'dark' : 
                  interview.status === 'scheduled' ? 'primary' : 
                  'success'
                }`}>
                  {interview.status}
                </span>
              </div>
              
              <p><strong>Job Role:</strong> {interview.jobRole}</p>
              
              {interview.description && (
                <p><strong>Description:</strong> {interview.description}</p>
              )}
              
              {interview.scheduledDate && (
                <p><strong>Scheduled:</strong> {new Date(interview.scheduledDate).toLocaleString()}</p>
              )}
              
              <p><strong>Questions:</strong> {interview.questions ? interview.questions.length : 0}</p>
              <p><strong>Participants:</strong> {interview.participants ? interview.participants.length : 0}</p>
              
              <div className="interview-actions">
                <Link to={`/interviews/${interview._id}`} className="btn btn-primary">
                  <i className="fas fa-eye"></i> View
                </Link>
                
                {(user.role === 'recruiter' || user.role === 'admin') && 
                 (user._id === interview.createdBy._id || user.role === 'admin') && (
                  <button
                    onClick={() => deleteInterview(interview._id)}
                    className="btn btn-danger"
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No interviews found</p>
      )}
    </section>
  );
};

export default Interviews;
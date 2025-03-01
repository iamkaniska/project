import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import AlertContext from '../../context/AlertContext';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  
  const [users, setUsers] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [usersRes, interviewsRes, questionsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users'),
          axios.get('http://localhost:5000/api/interviews'),
          axios.get('http://localhost:5000/api/questions')
        ]);
        
        setUsers(usersRes.data);
        setInterviews(interviewsRes.data);
        setQuestions(questionsRes.data);
        setLoading(false);
      } catch (err) {
        setAlert('Error fetching admin data', 'danger');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [setAlert]);
  
  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        setUsers(users.filter(user => user._id !== id));
        setAlert('User removed', 'success');
      } catch (err) {
        setAlert('Error deleting user', 'danger');
      }
    }
  };
  
  const deleteInterview = async (id) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      try {
        await axios.delete(`http://localhost:5000/api/interviews/${id}`);
        setInterviews(interviews.filter(interview => interview._id !== id));
        setAlert('Interview removed', 'success');
      } catch (err) {
        setAlert('Error deleting interview', 'danger');
      }
    }
  };
  
  const deleteQuestion = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await axios.delete(`http://localhost:5000/api/questions/${id}`);
        setQuestions(questions.filter(question => question._id !== id));
        setAlert('Question removed', 'success');
      } catch (err) {
        setAlert('Error deleting question', 'danger');
      }
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <section className="container">
      <h1 className="large text-primary">Admin Panel</h1>
      <p className="lead">
        <i className="fas fa-cog"></i> Manage the platform
      </p>
      
      <div className="admin-tabs">
        <button
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-light'}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`btn ${activeTab === 'interviews' ? 'btn-primary' : 'btn-light'}`}
          onClick={() => setActiveTab('interviews')}
        >
          Interviews
        </button>
        <button
          className={`btn ${activeTab === 'questions' ? 'btn-primary' : 'btn-light'}`}
          onClick={() => setActiveTab('questions')}
        >
          Questions
        </button>
      </div>
      
      {activeTab === 'users' && (
        <div className="admin-section">
          <h2 className="my-2">Users</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge badge-${
                      user.role === 'admin' ? 'danger' : 
                      user.role === 'recruiter' ? 'primary' : 
                      'success'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="btn btn-danger btn-sm"
                      disabled={user._id === user._id} // Prevent deleting self
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {activeTab === 'interviews' && (
        <div className="admin-section">
          <h2 className="my-2">Interviews</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Job Role</th>
                <th>Created By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map(interview => (
                <tr key={interview._id}>
                  <td>
                    <Link to={`/interviews/${interview._id}`}>
                      {interview.title}
                    </Link>
                  </td>
                  <td>{interview.jobRole}</td>
                  <td>{interview.createdBy.name}</td>
                  <td>
                    <span className={`badge badge-${
                      interview.status === 'draft' ? 'dark' : 
                      interview.status === 'scheduled' ? 'primary' : 
                      'success'
                    }`}>
                      {interview.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => deleteInterview(interview._id)}
                      className="btn btn-danger btn-sm"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {activeTab === 'questions' && (
        <div className="admin-section">
          <h2 className="my-2">Questions</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Category</th>
                <th>Job Role</th>
                <th>Difficulty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map(question => (
                <tr key={question._id}>
                  <td>{question.text}</td>
                  <td>
                    <span className={`badge badge-${
                      question.category === 'technical' ? 'primary' : 
                      question.category === 'behavioral' ? 'success' : 
                      'dark'
                    }`}>
                      {question.category}
                    </span>
                  </td>
                  <td>{question.jobRole}</td>
                  <td>{question.difficulty}</td>
                  <td>
                    <button
                      onClick={() => deleteQuestion(question._id)}
                      className="btn btn-danger btn-sm"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminPanel;
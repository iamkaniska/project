import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import AlertContext from '../../context/AlertContext';

const Questions = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    jobRole: ''
  });
  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { category, difficulty, jobRole } = filters;
        let url = 'http://localhost:5000/api/questions';
        
        // Add query parameters if filters are set
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (difficulty) params.append('difficulty', difficulty);
        if (jobRole) params.append('jobRole', jobRole);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const res = await axios.get(url);
        setQuestions(res.data);
        setLoading(false);
      } catch (err) {
        setAlert('Error fetching questions', 'danger');
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, [filters, setAlert]);
  
  const handleFilterChange = e => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
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
  
  return (
    <section className="container">
      <h1 className="large text-primary">Interview Questions</h1>
      <p className="lead">
        <i className="fas fa-question-circle"></i> Browse and manage interview questions
      </p>
      
      {(user.role === 'recruiter' || user.role === 'admin') && (
        <div className="dash-buttons">
          <Link to="/generate-questions" className="btn btn-primary">
            <i className="fas fa-robot"></i> Generate AI Questions
          </Link>
        </div>
      )}
      
      <div className="filter-form my-2">
        <div className="grid grid-3">
          <div className="form-group">
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All Categories</option>
              <option value="technical">Technical</option>
              <option value="behavioral">Behavioral</option>
              <option value="general">General</option>
            </select>
          </div>
          
          <div className="form-group">
            <select
              name="difficulty"
              value={filters.difficulty}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div className="form-group">
            <input
              type="text"
              placeholder="Job Role"
              name="jobRole"
              value={filters.jobRole}
              onChange={handleFilterChange}
              className="form-control"
            />
          </div>
        </div>
      </div>
      
      {loading ? (
        <div>Loading...</div>
      ) : questions.length > 0 ? (
        <div className="questions">
          {questions.map(question => (
            <div key={question._id} className="card">
              <div className="question-header">
                <h3>{question.text}</h3>
                <div>
                  <span className={`badge badge-${question.category === 'technical' ? 'primary' : question.category === 'behavioral' ? 'success' : 'dark'}`}>
                    {question.category}
                  </span>
                  <span className="badge badge-light">{question.difficulty}</span>
                  {question.isAIGenerated && (
                    <span className="badge badge-info">AI Generated</span>
                  )}
                </div>
              </div>
              
              <p><strong>Job Role:</strong> {question.jobRole}</p>
              
              {question.suggestedAnswer && (
                <div className="suggested-answer">
                  <h4>Suggested Answer:</h4>
                  <p>{question.suggestedAnswer}</p>
                </div>
              )}
              
              {(user.role === 'recruiter' || user.role === 'admin') && (
                <div className="question-actions">
                  <button
                    onClick={() => deleteQuestion(question._id)}
                    className="btn btn-danger"
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No questions found</p>
      )}
    </section>
  );
};

export default Questions;
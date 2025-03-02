import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import AlertContext from '../../context/AlertContext';

const GenerateQuestions = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  
  const [formData, setFormData] = useState({
    jobRole: '',
    category: 'technical',
    count: 5
  });
  
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { jobRole, category, count } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    
    if (!jobRole) {
      return setAlert('Please enter a job role', 'danger');
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token"); // Corrected method
      const res = await axios.post(
        "http://localhost:5001/api/questions/generate",
        {
          jobRole,
          category,
          count: parseInt(count, 10),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Corrected placement of headers
          },
        }
      );
    } catch (error) {
      console.error("Error generating questions:", error);
    }
     finally {
      setLoading(false);
    }
  };
  
  return (
    <section className="container">
      <h1 className="large text-primary">Generate AI Interview Questions</h1>
      <p className="lead">
        <i className="fas fa-robot"></i> Create custom interview questions using AI
      </p>
      
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Job Role (e.g., React Developer, Product Manager)"
            name="jobRole"
            value={jobRole}
            onChange={onChange}
            className="form-control"
          />
          <small className="form-text">
            Enter the specific job role you're preparing for
          </small>
        </div>
        
        <div className="form-group">
          <select
            name="category"
            value={category}
            onChange={onChange}
            className="form-select"
          >
            <option value="technical">Technical</option>
            <option value="behavioral">Behavioral</option>
            <option value="general">General</option>
          </select>
          <small className="form-text">
            Select the type of questions you want to generate
          </small>
        </div>
        
        <div className="form-group">
          <select
            name="count"
            value={count}
            onChange={onChange}
            className="form-select"
          >
            <option value="3">3 Questions</option>
            <option value="5">5 Questions</option>
            <option value="10">10 Questions</option>
          </select>
          <small className="form-text">
            How many questions do you want to generate?
          </small>
        </div>
        
        <input
          type="submit"
          value={loading ? 'Generating...' : 'Generate Questions'}
          className="btn btn-primary"
          disabled={loading}
        />
        
        <Link to="/questions" className="btn btn-light">
          Back to Questions
        </Link>
      </form>
      
      {loading && <div className="my-2">Generating questions, please wait...</div>}
      
      {generatedQuestions.length > 0 && (
        <div className="generated-questions my-2">
          <h2>Generated Questions</h2>
          
          {generatedQuestions.map((question, index) => (
            <div key={index} className="card my-1">
              <div className="question-header">
                <h3>{question.text}</h3>
                <div>
                  <span className={`badge badge-${question.category === 'technical' ? 'primary' : question.category === 'behavioral' ? 'success' : 'dark'}`}>
                    {question.category}
                  </span>
                  <span className="badge badge-light">{question.difficulty}</span>
                  <span className="badge badge-info">AI Generated</span>
                </div>
              </div>
              
              {question.suggestedAnswer && (
                <div className="suggested-answer">
                  <h4>Suggested Answer:</h4>
                  <p>{question.suggestedAnswer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default GenerateQuestions;
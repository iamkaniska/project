import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import AlertContext from '../../context/AlertContext';

const CreateInterview = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobRole: '',
    scheduledDate: '',
    questions: [],
    participants: []
  });
  
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  const { title, description, jobRole, scheduledDate } = formData;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch questions
        const questionsRes = await axios.get('http://localhost:5001/api/questions');
        setAvailableQuestions(questionsRes.data);
        
        // Fetch job seekers (for recruiters to add to interviews)
        if (user.role === 'recruiter' || user.role === 'admin') {
          const usersRes = await axios.get('http://localhost:5001/api/users');
          // Filter to only show job seekers
          const jobSeekers = usersRes.data.filter(u => u.role === 'jobseeker');
          setAvailableUsers(jobSeekers);
        }
        
        setLoading(false);
      } catch (err) {
        setAlert('Error fetching data', 'danger');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user.role, setAlert]);
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const toggleQuestionSelection = (questionId) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };
  
  const toggleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    
    if (!title || !jobRole) {
      return setAlert('Title and job role are required', 'danger');
    }
    
    try {
      // Prepare participants array
      const participants = selectedUsers.map(userId => ({
        user: userId,
        status: 'pending'
      }));
      
      const interviewData = {
        title,
        description,
        jobRole,
        scheduledDate: scheduledDate || null,
        questions: selectedQuestions,
        participants
      };
      
      await axios.post('http://localhost:5001/api/interviews', interviewData);
      
      setAlert('Interview created successfully', 'success');
      navigate('/interviews');
    } catch (err) {
      setAlert('Error creating interview', 'danger');
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <section className="container">
      <h1 className="large text-primary">Create Interview</h1>
      <p className="lead">
        <i className="fas fa-user-tie"></i> Set up a new interview session
      </p>
      
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Interview Title"
            name="title"
            value={title}
            onChange={onChange}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <textarea
            placeholder="Description"
            name="description"
            value={description}
            onChange={onChange}
            className="form-control"
          ></textarea>
          <small className="form-text">
            Provide details about this interview
          </small>
        </div>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Job Role"
            name="jobRole"
            value={jobRole}
            onChange={onChange}
            className="form-control"
          />
          <small className="form-text">
            What position is this interview for?
          </small>
        </div>
        
        <div className="form-group">
          <input
            type="datetime-local"
            name="scheduledDate"
            value={scheduledDate}
            onChange={onChange}
            className="form-control"
          />
          <small className="form-text">
            When will this interview take place? (Optional)
          </small>
        </div>
        
        <div className="form-group">
          <h3>Select Questions</h3>
          <div className="question-selection">
            {availableQuestions.length > 0 ? (
              availableQuestions.map(question => (
                <div key={question._id} className="question-select-item">
                  <input
                    type="checkbox"
                    id={`question-${question._id}`}
                    checked={selectedQuestions.includes(question._id)}
                    onChange={() => toggleQuestionSelection(question._id)}
                  />
                  <label htmlFor={`question-${question._id}`}>
                    {question.text}
                    <div>
                      <span className={`badge badge-${
                        question.category === 'technical' ? 'primary' : 
                        question.category === 'behavioral' ? 'success' : 
                        'dark'
                      }`}>
                        {question.category}
                      </span>
                      <span className="badge badge-light">{question.difficulty}</span>
                    </div>
                  </label>
                </div>
              ))
            ) : (
              <p>No questions available. <Link to="/generate-questions">Generate some questions</Link> first.</p>
            )}
          </div>
        </div>
        
        <div className="form-group">
          <h3>Select Participants</h3>
          <div className="user-selection">
            {availableUsers.length > 0 ? (
              availableUsers.map(user => (
                <div key={user._id} className="user-select-item">
                  <input
                    type="checkbox"
                    id={`user-${user._id}`}
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => toggleUserSelection(user._id)}
                  />
                  <label htmlFor={`user-${user._id}`}>
                    {user.name} ({user.email})
                  </label>
                </div>
              ))
            ) : (
              <p>No job seekers available.</p>
            )}
          </div>
        </div>
        
        <input type="submit" className="btn btn-primary my-1" value="Create Interview" />
        <Link className="btn btn-light my-1" to="/interviews">
          Cancel
        </Link>
      </form>
    </section>
  );
};

export default CreateInterview;
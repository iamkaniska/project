import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import AlertContext from '../../context/AlertContext';

const EditProfile = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: '',
    company: '',
    position: '',
    targetRole: '',
    industry: ''
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`https://interview-prepare.onrender.com/api/users/${user._id}`);
        const profileData = res.data;
        
        setFormData({
          name: profileData.name || '',
          bio: profileData.profile?.bio || '',
          skills: profileData.profile?.skills ? profileData.profile.skills.join(', ') : '',
          company: profileData.profile?.company || '',
          position: profileData.profile?.position || '',
          targetRole: profileData.profile?.targetRole || '',
          industry: profileData.profile?.industry || ''
        });
        
        setLoading(false);
      } catch (err) {
        setAlert('Error fetching profile', 'danger');
        setLoading(false);
      }
    };
    
    if (user) {
      fetchProfile();
    }
  }, [user, setAlert]);
  
  const { name, bio, skills, company, position, targetRole, industry } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    
    try {
      const profileData = {
        name,
        profile: {
          bio,
          skills: skills.split(',').map(skill => skill.trim()),
          company,
          position,
          targetRole,
          industry
        }
      };
      
      await axios.put('https://interview-prepare.onrender.com/api/users/profile', profileData);
      
      setAlert('Profile updated', 'success');
      navigate('/profile');
    } catch (err) {
      setAlert('Error updating profile', 'danger');
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <section className="container">
      <h1 className="large text-primary">Edit Your Profile</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Update your information
      </p>
      
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={onChange}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <textarea
            placeholder="A short bio of yourself"
            name="bio"
            value={bio}
            onChange={onChange}
            className="form-control"
          ></textarea>
          <small className="form-text">Tell us a little about yourself</small>
        </div>
        
        {user.role === 'jobseeker' && (
          <>
            <div className="form-group">
              <input
                type="text"
                placeholder="Skills"
                name="skills"
                value={skills}
                onChange={onChange}
                className="form-control"
              />
              <small className="form-text">
                Please use comma separated values (eg. HTML,CSS,JavaScript)
              </small>
            </div>
            
            <div className="form-group">
              <input
                type="text"
                placeholder="Target Role"
                name="targetRole"
                value={targetRole}
                onChange={onChange}
                className="form-control"
              />
              <small className="form-text">
                What position are you targeting in your job search?
              </small>
            </div>
            
            <div className="form-group">
              <input
                type="text"
                placeholder="Industry"
                name="industry"
                value={industry}
                onChange={onChange}
                className="form-control"
              />
              <small className="form-text">
                What industry are you interested in?
              </small>
            </div>
          </>
        )}
        
        {user.role === 'recruiter' && (
          <>
            <div className="form-group">
              <input
                type="text"
                placeholder="Company"
                name="company"
                value={company}
                onChange={onChange}
                className="form-control"
              />
              <small className="form-text">
                Company you represent
              </small>
            </div>
            
            <div className="form-group">
              <input
                type="text"
                placeholder="Position"
                name="position"
                value={position}
                onChange={onChange}
                className="form-control"
              />
              <small className="form-text">
                Your position at the company
              </small>
            </div>
          </>
        )}
        
        <input type="submit" className="btn btn-primary my-1" value="Save Changes" />
        <Link className="btn btn-light my-1" to="/profile">
          Go Back
        </Link>
      </form>
    </section>
  );
};

export default EditProfile;
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import AlertContext from '../../context/AlertContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${user._id}`);
        setProfile(res.data);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="container">
      <Link to="/dashboard" className="btn btn-light">
        Back To Dashboard
      </Link>
      
      <div className="profile-grid my-1">
        <div className="profile-top bg-primary p-2">
          <h1 className="large">{profile.name}</h1>
          <p className="lead">
            {profile.role === 'jobseeker' && profile.profile?.targetRole 
              ? profile.profile.targetRole 
              : profile.role === 'recruiter' && profile.profile?.position 
                ? `${profile.profile.position} at ${profile.profile.company}` 
                : profile.role}
          </p>
          <Link to="/edit-profile" className="btn btn-dark">
            Edit Profile
          </Link>
        </div>

        {profile.profile?.bio && (
          <div className="profile-about bg-light p-2">
            <h2 className="text-primary">Bio</h2>
            <p>{profile.profile.bio}</p>
          </div>
        )}

        {profile.role === 'jobseeker' && profile.profile?.skills && profile.profile.skills.length > 0 && (
          <div className="profile-skills bg-light p-2">
            <h2 className="text-primary">Skills</h2>
            <div className="skills">
              {profile.profile.skills.map((skill, index) => (
                <div key={index} className="p-1">
                  <i className="fas fa-check"></i> {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.role === 'jobseeker' && profile.profile?.experience && profile.profile.experience.length > 0 && (
          <div className="profile-exp bg-white p-2">
            <h2 className="text-primary">Experience</h2>
            {profile.profile.experience.map((exp, index) => (
              <div key={index}>
                <h3>{exp.company}</h3>
                <p>{new Date(exp.from).toLocaleDateString()} - {exp.current ? 'Current' : new Date(exp.to).toLocaleDateString()}</p>
                <p><strong>Position: </strong>{exp.title}</p>
                <p><strong>Description: </strong>{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {profile.role === 'jobseeker' && profile.profile?.education && profile.profile.education.length > 0 && (
          <div className="profile-edu bg-white p-2">
            <h2 className="text-primary">Education</h2>
            {profile.profile.education.map((edu, index) => (
              <div key={index}>
                <h3>{edu.school}</h3>
                <p>{new Date(edu.from).toLocaleDateString()} - {edu.current ? 'Current' : new Date(edu.to).toLocaleDateString()}</p>
                <p><strong>Degree: </strong>{edu.degree}</p>
                <p><strong>Field of Study: </strong>{edu.fieldOfStudy}</p>
                <p><strong>Description: </strong>{edu.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [message, setMessage] = useState('');

  const loadJob = async () => {
    const { data } = await api.get(`/jobs/${id}`);
    setJob(data);
  };

  useEffect(() => {
    loadJob();
  }, [id]);

  const apply = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const { data } = await api.post(`/applications/apply/${id}`, { cover_letter: coverLetter });
      setMessage(data.message);
      setCoverLetter('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not apply.');
    }
  };

  if (!job) return <div className="loader">Loading job...</div>;

  return (
    <main className="page-wrap narrow">
      <article className="detail-card animated-card">
        <span className="badge">{job.job_type}</span>
        <h1>{job.title}</h1>
        <p className="muted">{job.company_name} • {job.location}</p>
        {job.salary && <p className="salary">💰 {job.salary}</p>}
        <h3>Job Description</h3>
        <p>{job.description}</p>
        <h3>Skills Required</h3>
        <div className="skills">
          {job.skills?.split(',').map((skill) => <span key={skill}>{skill.trim()}</span>)}
        </div>
      </article>

      {user?.role === 'job_seeker' ? (
        <form className="apply-card animated-card" onSubmit={apply}>
          <h2>Apply for this job</h2>
          {message && <p className="alert success">{message}</p>}
          <textarea
            rows="5"
            placeholder="Write a short cover letter..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
          <button className="btn" type="submit">Submit Application</button>
        </form>
      ) : !user ? (
        <p className="center-text">Please <Link to="/login">login</Link> as a job seeker to apply.</p>
      ) : null}
    </main>
  );
};

export default JobDetails;

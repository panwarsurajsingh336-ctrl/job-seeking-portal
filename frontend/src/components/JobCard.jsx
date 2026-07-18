import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job, featured = false }) => {
  const skillList = job.skills ? job.skills.split(',').map((skill) => skill.trim()) : [];

  return (
    <article className={`job-card animated-card ${featured ? 'featured-job' : ''}`}>
      <div className="card-top">
        <div>
          <h3>{job.title}</h3>
          <p>{job.company_name || 'Company'}</p>
        </div>
        <div className="badge-stack">
          {featured && <span className="badge hot">Current opening</span>}
          <span className="badge">{job.job_type}</span>
        </div>
      </div>

      <p className="muted">Location: {job.location}</p>
      {job.salary && <p className="salary">Salary: {job.salary}</p>}
      <p className="job-desc">{job.description.slice(0, 120)}...</p>

      <div className="skills">
        {skillList.slice(0, 4).map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>

      <Link to={`/jobs/${job.id}`} className="btn btn-full">View Details</Link>
    </article>
  );
};

export default JobCard;

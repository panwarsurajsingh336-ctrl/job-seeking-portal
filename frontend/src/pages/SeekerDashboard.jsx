import React, { useEffect, useState } from 'react';
import api from '../api/api.js';
import StatCard from '../components/StatCard.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';

const SeekerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [resumeName, setResumeName] = useState(localStorage.getItem('hirevyom_resume') || '');

  const loadApplications = async () => {
    const { data } = await api.get('/applications/my');
    setApplications(data);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const shortlisted = applications.filter((app) => app.status === 'shortlisted').length;
  const pending = applications.filter((app) => app.status === 'pending').length;

  const handleResumeUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setResumeName(file.name);
    localStorage.setItem('hirevyom_resume', file.name);
  };

  return (
    <DashboardLayout title="Job Seeker" links={[{ label: 'Browse Jobs', path: '/jobs' }, { label: 'My Applications', path: '/applications' }]}>
      <div className="dashboard-header">
        <span className="eyebrow">Your activity</span>
        <h1>Job Seeker Dashboard</h1>
      </div>

      <div className="stats-grid small">
        <StatCard title="Total Applications" value={applications.length} icon="CV" />
        <StatCard title="Shortlisted" value={shortlisted} icon="OK" />
        <StatCard title="Pending" value={pending} icon="IN" />
      </div>

      <div className="resume-card animated-card">
        <div>
          <span className="eyebrow">Resume Center</span>
          <h2>Keep your resume ready before you apply</h2>
          <p className="muted">
            Upload a PDF or document name here so your dashboard always shows your latest resume.
          </p>
          {resumeName && <p className="resume-name">Selected resume: {resumeName}</p>}
        </div>
        <label className="resume-upload">
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
          <span>{resumeName ? 'Replace Resume' : 'Upload Resume'}</span>
        </label>
      </div>

      <div className="table-card animated-card">
        <h2>Recent Applications</h2>
        <table>
          <thead>
            <tr><th>Job</th><th>Company</th><th>Status</th></tr>
          </thead>
          <tbody>
            {applications.slice(0, 5).map((app) => (
              <tr key={app.id}>
                <td>{app.title}</td>
                <td>{app.company_name}</td>
                <td><span className={`status ${app.status}`}>{app.status}</span></td>
              </tr>
            ))}
            {applications.length === 0 && <tr><td colSpan="3">No applications yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default SeekerDashboard;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api.js';
import StatCard from '../components/StatCard.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const loadData = async () => {
    const [jobRes, appRes] = await Promise.all([
      api.get('/jobs/employer/my'),
      api.get('/applications/employer')
    ]);
    setJobs(jobRes.data);
    setApplications(appRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateApplication = async (id, status) => {
    await api.put(`/applications/${id}/status`, { status });
    loadData();
  };

  const deleteJob = async (id) => {
    if (!confirm('Delete this job?')) return;
    await api.delete(`/jobs/${id}`);
    loadData();
  };

  return (
    <DashboardLayout title="Employer" links={[{ label: 'Post Job', path: '/post-job' }, { label: 'Browse Jobs', path: '/jobs' }]}>
      <div className="dashboard-header spread">
        <div>
          <span className="eyebrow">Hiring center</span>
          <h1>Employer Dashboard</h1>
        </div>
        <Link to="/post-job" className="btn">Add Job Post</Link>
      </div>

      <div className="stats-grid small">
        <StatCard title="Posted Jobs" value={jobs.length} icon="JOB" />
        <StatCard title="Applications" value={applications.length} icon="APP" />
        <StatCard title="Open Jobs" value={jobs.filter((j) => j.status === 'open').length} icon="ON" />
      </div>

      <div className="table-card animated-card">
        <h2>My Job Posts</h2>
        <table>
          <thead>
            <tr><th>Title</th><th>Status</th><th>Applications</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td><span className={`status ${job.status}`}>{job.status}</span></td>
                <td>{job.application_count}</td>
                <td>
                  <div className="table-actions">
                    <Link className="action-link" to={`/post-job/${job.id}`}>Edit</Link>
                    <button className="danger-link" onClick={() => deleteJob(job.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && <tr><td colSpan="4">No job posts yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="table-card animated-card">
        <h2>Applicants</h2>
        <table>
          <thead>
            <tr><th>Candidate</th><th>Email</th><th>Job</th><th>Status</th><th>Profile</th><th>Update</th></tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.seeker_name}</td>
                <td>{app.seeker_email}</td>
                <td>{app.title}</td>
                <td><span className={`status ${app.status}`}>{app.status}</span></td>
                <td>
                  <button className="action-link button-link" onClick={() => setSelectedApplicant(app)}>
                    View Profile
                  </button>
                </td>
                <td>
                  <select value={app.status} onChange={(e) => updateApplication(app.id, e.target.value)}>
                    <option value="pending">pending</option>
                    <option value="shortlisted">shortlisted</option>
                    <option value="rejected">rejected</option>
                  </select>
                </td>
              </tr>
            ))}
            {applications.length === 0 && <tr><td colSpan="6">No applicants yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {selectedApplicant && (
        <div className="profile-panel animated-card">
          <div className="dashboard-header spread">
            <div>
              <span className="eyebrow">Applicant profile</span>
              <h2>{selectedApplicant.seeker_name}</h2>
            </div>
            <button className="danger-link" onClick={() => setSelectedApplicant(null)}>Close</button>
          </div>
          <div className="profile-grid">
            <div>
              <strong>Email</strong>
              <p>{selectedApplicant.seeker_email}</p>
            </div>
            <div>
              <strong>Applied For</strong>
              <p>{selectedApplicant.title}</p>
            </div>
            <div>
              <strong>Application Status</strong>
              <p><span className={`status ${selectedApplicant.status}`}>{selectedApplicant.status}</span></p>
            </div>
            <div>
              <strong>Applied On</strong>
              <p>{new Date(selectedApplicant.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="cover-letter-box">
            <strong>Cover Letter</strong>
            <p>{selectedApplicant.cover_letter || 'No cover letter added.'}</p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EmployerDashboard;

import React, { useEffect, useState } from 'react';
import api from '../api/api.js';
import StatCard from '../components/StatCard.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, jobs: 0, applications: 0, openJobs: 0 });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const loadAdminData = async () => {
    const [statsRes, usersRes, jobsRes, appsRes] = await Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users'),
      api.get('/admin/jobs'),
      api.get('/admin/applications')
    ]);
    setStats(statsRes.data);
    setUsers(usersRes.data);
    setJobs(jobsRes.data);
    setApplications(appsRes.data);
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    await api.delete(`/admin/users/${id}`);
    loadAdminData();
  };

  const deleteJob = async (id) => {
    if (!confirm('Delete this job?')) return;
    await api.delete(`/admin/jobs/${id}`);
    loadAdminData();
  };

  const updateJobStatus = async (job, status) => {
    await api.put(`/admin/jobs/${job.id}`, { ...job, status });
    loadAdminData();
  };

  const updateApplicationStatus = async (id, status) => {
    await api.put(`/admin/applications/${id}/status`, { status });
    loadAdminData();
  };

  return (
    <DashboardLayout title="Admin Panel" links={[{ label: 'Jobs', path: '/jobs' }]}>
      <div className="dashboard-header">
        <span className="eyebrow">Platform control</span>
        <h1>Admin Dashboard</h1>
      </div>

      <div className="stats-grid small">
        <StatCard title="Users" value={stats.users} icon="👥" />
        <StatCard title="Jobs" value={stats.jobs} icon="💼" />
        <StatCard title="Applications" value={stats.applications} icon="📨" />
        <StatCard title="Open Jobs" value={stats.openJobs} icon="🟢" />
      </div>

      <div className="table-card animated-card">
        <h2>Manage Users</h2>
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Company</th><th>Action</th></tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className="badge light">{user.role}</span></td>
                <td>{user.company_name || '-'}</td>
                <td><button className="danger-link" onClick={() => deleteUser(user.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-card animated-card">
        <h2>Manage Jobs</h2>
        <table>
          <thead>
            <tr><th>Title</th><th>Company</th><th>Type</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.company_name}</td>
                <td>{job.job_type}</td>
                <td>
                  <select value={job.status} onChange={(e) => updateJobStatus(job, e.target.value)}>
                    <option value="open">open</option>
                    <option value="closed">closed</option>
                  </select>
                </td>
                <td><button className="danger-link" onClick={() => deleteJob(job.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-card animated-card">
        <h2>All Applications</h2>
        <table>
          <thead>
            <tr><th>Candidate</th><th>Job</th><th>Company</th><th>Status</th></tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.seeker_name}</td>
                <td>{app.title}</td>
                <td>{app.company_name}</td>
                <td>
                  <select value={app.status} onChange={(e) => updateApplicationStatus(app.id, e.target.value)}>
                    <option value="pending">pending</option>
                    <option value="shortlisted">shortlisted</option>
                    <option value="rejected">rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

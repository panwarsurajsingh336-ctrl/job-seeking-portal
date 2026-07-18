import React, { useEffect, useState } from 'react';
import api from '../api/api.js';
import DashboardLayout from '../layouts/DashboardLayout.jsx';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  const loadApplications = async () => {
    const { data } = await api.get('/applications/my');
    setApplications(data);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <DashboardLayout title="Job Seeker" links={[{ label: 'Dashboard', path: '/seeker' }, { label: 'Browse Jobs', path: '/jobs' }]}>
      <div className="dashboard-header">
        <span className="eyebrow">Track progress</span>
        <h1>My Applications</h1>
      </div>

      <div className="table-card animated-card">
        <table>
          <thead>
            <tr><th>Job</th><th>Company</th><th>Location</th><th>Status</th></tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.title}</td>
                <td>{app.company_name}</td>
                <td>{app.location}</td>
                <td><span className={`status ${app.status}`}>{app.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default MyApplications;

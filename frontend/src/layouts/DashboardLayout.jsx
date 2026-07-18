import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const DashboardLayout = ({ title, children, links = [] }) => {
  const { user } = useAuth();

  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <h2>{title}</h2>
        <p className="muted">Welcome, {user?.name}</p>
        <div className="sidebar-links">
          {links.map((link) => (
            <Link key={link.path} to={link.path}>{link.label}</Link>
          ))}
        </div>
      </aside>
      <section className="dashboard-content">
        {children}
      </section>
    </main>
  );
};

export default DashboardLayout;

import React from 'react';
import { Link } from 'react-router-dom';
import homePoster from '../assets/hirevyom-home-poster.png';
import StatCard from '../components/StatCard.jsx';

const Home = () => {
  const highlights = [
    'Where Talent Meets Opportunity.',
    'Smarter Hiring. Better Careers.',
    'Your Career. Our Mission. Together, We Grow.'
  ];

  return (
    <main>
      <section className="home-hero">
        <div className="hero-content">
          <span className="eyebrow">HireVyom Career Platform</span>
          <h1>Find Jobs. Build Careers.</h1>
          <h2>Where Talent Meets Opportunity.</h2>
          <p>
            Discover better career opportunities, connect with trusted companies,
            and hire smarter with HireVyom.
          </p>
          <div className="hero-actions">
            <Link to="/jobs" className="btn">Explore Jobs</Link>
            <Link to="/register" className="btn btn-light">Hire Talent</Link>
          </div>
          <div className="hero-points">
            {highlights.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <div className="hero-media-column">
          <div className="hero-insight-bar animated-card">
            <div>
              <span>Active filters</span>
              <strong>Role, city, salary, work mode</strong>
            </div>
            <div>
              <span>For employers</span>
              <strong>Profiles, status, job edits</strong>
            </div>
          </div>
          <div className="poster-panel animated-card">
            <img src={homePoster} alt="HireVyom job portal poster" />
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard title="Active Jobs" value="12,500+" icon="JOB" />
        <StatCard title="Trusted Companies" value="500+" icon="TOP" />
        <StatCard title="Smart Match Accuracy" value="92%" icon="AI" />
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Why Choose HireVyom</span>
          <h2>One Platform. Endless Opportunities.</h2>
        </div>
        <div className="feature-grid">
          <div className="feature-card animated-card">
            <h3>Verified Companies</h3>
            <p>Connect with trusted and verified employers.</p>
          </div>
          <div className="feature-card animated-card">
            <h3>Smart Matching</h3>
            <p>Discover jobs that fit your skills, goals, and experience.</p>
          </div>
          <div className="feature-card animated-card">
            <h3>Career Growth</h3>
            <p>Find opportunities that help you grow faster.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;

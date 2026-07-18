import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/hirevyom-logo.png';

const footerContent = {
  '/': {
    label: 'Career launchpad',
    title: 'Find Jobs. Build Careers.',
    text: 'HireVyom helps job seekers discover better opportunities and helps companies find the right talent faster.',
    cta: 'Explore Jobs',
    to: '/jobs'
  },
  '/jobs': {
    label: 'Job discovery',
    title: 'Filter the noise out of your job search.',
    text: 'Use role, salary, location, and work mode filters to quickly find openings that match your next move.',
    cta: 'Create Profile',
    to: '/register'
  },
  '/login': {
    label: 'Welcome back',
    title: 'Pick up where your career flow left off.',
    text: 'Sign in to manage applications, update jobs, or review candidates from your dashboard.',
    cta: 'Register',
    to: '/register'
  },
  '/register': {
    label: 'Join HireVyom',
    title: 'Create a profile that works for you.',
    text: 'Job seekers can apply faster, and employers can manage openings and applicant profiles in one place.',
    cta: 'Browse Jobs',
    to: '/jobs'
  },
  '/seeker': {
    label: 'Seeker workspace',
    title: 'Keep your resume and applications organized.',
    text: 'Track pending applications, shortlist progress, and new opportunities from a focused dashboard.',
    cta: 'Find Jobs',
    to: '/jobs'
  },
  '/applications': {
    label: 'Application tracker',
    title: 'Every application has a clear status.',
    text: 'Review your recent applications and stay ready for the next employer response.',
    cta: 'More Jobs',
    to: '/jobs'
  },
  '/employer': {
    label: 'Hiring desk',
    title: 'Manage openings and candidate profiles.',
    text: 'Edit job posts, review applicant details, and update hiring decisions from one dashboard.',
    cta: 'Post Job',
    to: '/post-job'
  },
  '/post-job': {
    label: 'Job publishing',
    title: 'Write openings candidates can act on.',
    text: 'Add clear descriptions, salary ranges, city, and work mode so the right seekers can find you.',
    cta: 'Dashboard',
    to: '/employer'
  },
  '/admin': {
    label: 'Admin control',
    title: 'Keep the platform clean and useful.',
    text: 'Monitor users, jobs, and applications so the portal stays trustworthy for everyone.',
    cta: 'Jobs',
    to: '/jobs'
  }
};

const getFooterContent = (pathname, user) => {
  if (pathname.startsWith('/jobs/')) {
    return {
      label: 'Job details',
      title: 'Ready to make this opportunity yours?',
      text: 'Review the role, prepare your resume, and apply with a focused cover letter.',
      cta: user ? 'Dashboard' : 'Login to Apply',
      to: user ? (user.role === 'employer' ? '/employer' : '/seeker') : '/login'
    };
  }

  if (pathname.startsWith('/post-job/')) {
    return {
      label: 'Edit opening',
      title: 'Keep every job post accurate.',
      text: 'Update description, status, salary, location, and skills whenever hiring needs change.',
      cta: 'Employer Dashboard',
      to: '/employer'
    };
  }

  return footerContent[pathname] || footerContent['/'];
};

const Footer = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const content = getFooterContent(pathname, user);

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <div className="footer-logo">
          <span className="logo-mark"><img src={logo} alt="" /></span>
          <span className="logo-word">Hire<span>Vyom</span></span>
        </div>
        <p>HireVyom helps job seekers discover better career opportunities and helps companies find the right talent faster.</p>
      </div>
      <div className="footer-context">
        <span>{content.label}</span>
        <h2>{content.title}</h2>
        <p>{content.text}</p>
      </div>
      <p className="footer-tagline">Your Career. Our Mission. Together, We Grow.</p>
      <Link to={content.to} className="btn btn-light">{content.cta}</Link>
    </footer>
  );
};

export default Footer;

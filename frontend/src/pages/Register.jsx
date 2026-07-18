import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'job_seeker',
    company_name: '',
    adminSecret: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await register(form);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'employer') navigate('/employer');
      else navigate('/seeker');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card animated-card" onSubmit={handleSubmit}>
        <span className="eyebrow">Create account</span>
        <h2>Join HireVyom</h2>
        {error && <p className="alert error">{error}</p>}

        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required />

        <label>Register as</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="job_seeker">Job Seeker</option>
          <option value="employer">Employer</option>
          <option value="admin">Admin</option>
        </select>

        {form.role === 'employer' && (
          <>
            <label>Company Name</label>
            <input name="company_name" value={form.company_name} onChange={handleChange} required />
          </>
        )}

        {form.role === 'admin' && (
          <>
            <label>Admin Secret</label>
            <input name="adminSecret" value={form.adminSecret} onChange={handleChange} placeholder="admin123" required />
          </>
        )}

        <button className="btn btn-full" type="submit">Create Account</button>
        <p className="center-text">Already registered? <Link to="/login">Login</Link></p>
      </form>
    </main>
  );
};

export default Register;

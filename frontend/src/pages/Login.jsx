import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'employer') navigate('/employer');
      else navigate('/seeker');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card animated-card" onSubmit={handleSubmit}>
        <span className="eyebrow">Welcome back</span>
        <h2>Login to HireVyom</h2>
        {error && <p className="alert error">{error}</p>}

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required />

        <button className="btn btn-full" type="submit">Login</button>
        <p className="center-text">New user? <Link to="/register">Create account</Link></p>
      </form>
    </main>
  );
};

export default Login;

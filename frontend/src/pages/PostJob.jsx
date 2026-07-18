import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api.js';
import DashboardLayout from '../layouts/DashboardLayout.jsx';

const PostJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    job_type: 'Full Time',
    salary: '',
    skills: '',
    status: 'open'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    const loadJob = async () => {
      if (!isEditing) return;

      try {
        const { data } = await api.get(`/jobs/${id}`);
        setForm({
          title: data.title || '',
          description: data.description || '',
          location: data.location || '',
          job_type: data.job_type || 'Full Time',
          salary: data.salary || '',
          skills: data.skills || '',
          status: data.status || 'open'
        });
      } catch (error) {
        setError(error.response?.data?.message || 'Could not load job.');
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id, isEditing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isEditing) {
        await api.put(`/jobs/${id}`, form);
      } else {
        await api.post('/jobs', form);
      }
      navigate('/employer');
    } catch (error) {
      setError(error.response?.data?.message || `Could not ${isEditing ? 'update' : 'create'} job.`);
    }
  };

  if (loading) {
    return <div className="loader">Loading job...</div>;
  }

  return (
    <DashboardLayout title="Employer" links={[{ label: 'Dashboard', path: '/employer' }, { label: 'Browse Jobs', path: '/jobs' }]}>
      <form className="form-card animated-card" onSubmit={handleSubmit}>
        <span className="eyebrow">{isEditing ? 'Edit opening' : 'New opening'}</span>
        <h1>{isEditing ? 'Edit Job Post' : 'Add Job Post'}</h1>
        {error && <p className="alert error">{error}</p>}

        <label>Job Title</label>
        <input name="title" value={form.title} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" rows="6" value={form.description} onChange={handleChange} required />

        <div className="two-col">
          <div>
            <label>Location</label>
            <input name="location" value={form.location} onChange={handleChange} required />
          </div>
          <div>
            <label>Job Type</label>
            <select name="job_type" value={form.job_type} onChange={handleChange}>
              <option>Full Time</option>
              <option>Part Time</option>
              <option>Internship</option>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>Work From Home</option>
              <option>Contract</option>
            </select>
          </div>
        </div>

        <label>Salary</label>
        <input name="salary" placeholder="Example: 4 LPA - 8 LPA" value={form.salary} onChange={handleChange} />

        <label>Skills</label>
        <input name="skills" placeholder="React, Node, MySQL" value={form.skills} onChange={handleChange} />

        {isEditing && (
          <>
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="open">open</option>
              <option value="closed">closed</option>
            </select>
          </>
        )}

        <button className="btn" type="submit">{isEditing ? 'Save Changes' : 'Publish Job'}</button>
      </form>
    </DashboardLayout>
  );
};

export default PostJob;

import pool from '../config/db.js';

export const getAllJobs = async (req, res) => {
  try {
    const [jobs] = await pool.query(
      `SELECT jobs.*, users.name AS employer_name, users.company_name
       FROM jobs
       JOIN users ON jobs.employer_id = users.id
       WHERE jobs.status = 'open'
       ORDER BY jobs.created_at DESC`
    );
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch jobs.', error: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const [jobs] = await pool.query(
      `SELECT jobs.*, users.name AS employer_name, users.company_name
       FROM jobs
       JOIN users ON jobs.employer_id = users.id
       WHERE jobs.id = ?`,
      [req.params.id]
    );

    if (jobs.length === 0) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    res.json(jobs[0]);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch job.', error: error.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const { title, description, location, job_type, salary, skills } = req.body;

    if (!title || !description || !location || !job_type) {
      return res.status(400).json({ message: 'Title, description, location and job type are required.' });
    }

    const [result] = await pool.query(
      `INSERT INTO jobs (title, description, location, job_type, salary, skills, employer_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, location, job_type, salary || null, skills || null, req.user.id]
    );

    res.status(201).json({ message: 'Job created successfully.', jobId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Could not create job.', error: error.message });
  }
};

export const getEmployerJobs = async (req, res) => {
  try {
    const [jobs] = await pool.query(
      `SELECT jobs.*,
        COUNT(applications.id) AS application_count
       FROM jobs
       LEFT JOIN applications ON jobs.id = applications.job_id
       WHERE jobs.employer_id = ?
       GROUP BY jobs.id
       ORDER BY jobs.created_at DESC`,
      [req.user.id]
    );
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch employer jobs.', error: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { title, description, location, job_type, salary, skills, status } = req.body;

    const [jobs] = await pool.query('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
    if (jobs.length === 0) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    const job = jobs[0];
    if (job.employer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can update only your own jobs.' });
    }

    await pool.query(
      `UPDATE jobs SET title=?, description=?, location=?, job_type=?, salary=?, skills=?, status=? WHERE id=?`,
      [
        title || job.title,
        description || job.description,
        location || job.location,
        job_type || job.job_type,
        salary ?? job.salary,
        skills ?? job.skills,
        status || job.status,
        req.params.id
      ]
    );

    res.json({ message: 'Job updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Could not update job.', error: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const [jobs] = await pool.query('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
    if (jobs.length === 0) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    const job = jobs[0];
    if (job.employer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can delete only your own jobs.' });
    }

    await pool.query('DELETE FROM jobs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Job deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Could not delete job.', error: error.message });
  }
};

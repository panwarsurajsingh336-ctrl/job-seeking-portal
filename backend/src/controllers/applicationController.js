import pool from '../config/db.js';

export const applyForJob = async (req, res) => {
  try {
    const { cover_letter } = req.body;
    const jobId = req.params.jobId;

    const [jobs] = await pool.query('SELECT id, status FROM jobs WHERE id = ?', [jobId]);
    if (jobs.length === 0) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    if (jobs[0].status !== 'open') {
      return res.status(400).json({ message: 'This job is closed.' });
    }

    await pool.query(
      'INSERT INTO applications (job_id, seeker_id, cover_letter) VALUES (?, ?, ?)',
      [jobId, req.user.id, cover_letter || null]
    );

    res.status(201).json({ message: 'Application submitted successfully.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'You already applied for this job.' });
    }
    res.status(500).json({ message: 'Could not apply for job.', error: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const [applications] = await pool.query(
      `SELECT applications.*, jobs.title, jobs.location, jobs.job_type, users.company_name
       FROM applications
       JOIN jobs ON applications.job_id = jobs.id
       JOIN users ON jobs.employer_id = users.id
       WHERE applications.seeker_id = ?
       ORDER BY applications.created_at DESC`,
      [req.user.id]
    );
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch applications.', error: error.message });
  }
};

export const getApplicationsForEmployer = async (req, res) => {
  try {
    const [applications] = await pool.query(
      `SELECT applications.*, jobs.title, users.name AS seeker_name, users.email AS seeker_email
       FROM applications
       JOIN jobs ON applications.job_id = jobs.id
       JOIN users ON applications.seeker_id = users.id
       WHERE jobs.employer_id = ?
       ORDER BY applications.created_at DESC`,
      [req.user.id]
    );
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch employer applications.', error: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid application status.' });
    }

    const [applications] = await pool.query(
      `SELECT applications.id, jobs.employer_id
       FROM applications
       JOIN jobs ON applications.job_id = jobs.id
       WHERE applications.id = ?`,
      [req.params.id]
    );

    if (applications.length === 0) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    if (applications[0].employer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can update only your own job applications.' });
    }

    await pool.query('UPDATE applications SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Application status updated.' });
  } catch (error) {
    res.status(500).json({ message: 'Could not update application.', error: error.message });
  }
};

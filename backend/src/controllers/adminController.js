import pool from '../config/db.js';

export const getAdminStats = async (req, res) => {
  try {
    const [[users]] = await pool.query('SELECT COUNT(*) AS total FROM users');
    const [[jobs]] = await pool.query('SELECT COUNT(*) AS total FROM jobs');
    const [[applications]] = await pool.query('SELECT COUNT(*) AS total FROM applications');
    const [[openJobs]] = await pool.query("SELECT COUNT(*) AS total FROM jobs WHERE status = 'open'");

    res.json({
      users: users.total,
      jobs: jobs.total,
      applications: applications.total,
      openJobs: openJobs.total
    });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch admin stats.', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, company_name, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch users.', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (Number(req.params.id) === req.user.id) {
      return res.status(400).json({ message: 'Admin cannot delete own account.' });
    }

    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Could not delete user.', error: error.message });
  }
};

export const getAllJobsAdmin = async (req, res) => {
  try {
    const [jobs] = await pool.query(
      `SELECT jobs.*, users.name AS employer_name, users.company_name
       FROM jobs
       JOIN users ON jobs.employer_id = users.id
       ORDER BY jobs.created_at DESC`
    );
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch all jobs.', error: error.message });
  }
};

export const getAllApplicationsAdmin = async (req, res) => {
  try {
    const [applications] = await pool.query(
      `SELECT applications.*, jobs.title, seekers.name AS seeker_name, seekers.email AS seeker_email,
        employers.company_name
       FROM applications
       JOIN jobs ON applications.job_id = jobs.id
       JOIN users AS seekers ON applications.seeker_id = seekers.id
       JOIN users AS employers ON jobs.employer_id = employers.id
       ORDER BY applications.created_at DESC`
    );
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch all applications.', error: error.message });
  }
};

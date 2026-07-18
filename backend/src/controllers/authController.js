import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const makeToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, company_name, adminSecret } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required.' });
    }

    if (!['job_seeker', 'employer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role selected.' });
    }

    if (role === 'admin' && adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: 'Invalid admin secret.' });
    }

    if (role === 'employer' && !company_name) {
      return res.status(400).json({ message: 'Company name is required for employers.' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, company_name) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, company_name || null]
    );

    const user = { id: result.insertId, name, email, role };
    res.status(201).json({ user, token: makeToken(user) });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed.', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company_name: user.company_name
    };

    res.json({ user: safeUser, token: makeToken(safeUser) });
  } catch (error) {
    res.status(500).json({ message: 'Login failed.', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, company_name, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Could not load profile.', error: error.message });
  }
};

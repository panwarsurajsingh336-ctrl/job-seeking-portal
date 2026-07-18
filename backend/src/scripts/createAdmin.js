import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import pool from '../config/db.js';

dotenv.config();

const createAdmin = async () => {
  const name = 'Admin User';
  const email = 'admin@example.com';
  const password = 'admin12345';

  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    console.log('Admin already exists: admin@example.com');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, 'admin']
  );

  console.log('Admin created successfully');
  console.log('Email: admin@example.com');
  console.log('Password: admin12345');
  process.exit(0);
};

createAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});

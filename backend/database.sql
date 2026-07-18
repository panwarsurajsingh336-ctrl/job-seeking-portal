CREATE DATABASE IF NOT EXISTS job_portal_db;
USE job_portal_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('job_seeker', 'employer', 'admin') NOT NULL DEFAULT 'job_seeker',
  company_name VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(120) NOT NULL,
  job_type ENUM('Full Time', 'Part Time', 'Internship', 'Remote', 'Hybrid', 'Work From Home', 'Contract') NOT NULL,
  salary VARCHAR(100),
  skills VARCHAR(255),
  employer_id INT NOT NULL,
  status ENUM('open', 'closed') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  seeker_id INT NOT NULL,
  cover_letter TEXT,
  status ENUM('pending', 'shortlisted', 'rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_application (job_id, seeker_id),
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (seeker_id) REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE jobs
  MODIFY job_type ENUM('Full Time', 'Part Time', 'Internship', 'Remote', 'Hybrid', 'Work From Home', 'Contract') NOT NULL;

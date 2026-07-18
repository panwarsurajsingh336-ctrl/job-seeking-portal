# HireVyom - Full Stack Job Seeking Website

HireVyom is a beginner-friendly full-stack job portal website built with:

- React + Vite frontend
- Node.js + Express backend
- MySQL database
- JWT authentication
- Role-based dashboards for Job Seeker, Employer, and Admin
- Premium dark navy, electric blue, cyan, and violet UI using plain CSS

# Demo Accounts
   Role   	    Email,          	   Password
👤 Job Seeker	  seeker@demo.com      demo123
🏢 Employer  	  employer@demo.com    demo123
🛠️ Admin      	admin@demo.com	     demo123

## Brand

HireVyom means a modern career and hiring platform where job seekers rise higher and companies discover better talent.

Tagline:

```text
Find Jobs. Build Careers.
```

Supporting line:

```text
Where Talent Meets Opportunity.
```

## Features

### Job Seeker
- Register/login
- Browse jobs
- View job details
- Apply to jobs with cover letter
- Track application status

### Employer
- Register/login with company name
- Add job posts
- View own jobs
- View applicants
- Shortlist/reject applicants
- Delete job posts

### Admin
- View platform stats
- Manage users
- Manage jobs
- Manage applications
- Open/close/delete jobs
- Update application status

## Folder Structure

```text
job-seeking-portal/
  backend/
    database.sql
    package.json
    .env.example
    src/
      config/db.js
      controllers/
      middleware/
      routes/
      scripts/createAdmin.js
      server.js
  frontend/
    package.json
    index.html
    src/
      api/api.js
      context/AuthContext.jsx
      components/
      layouts/
      pages/
      styles/global.css
```

## Setup Step 1: Create MySQL Database

Open MySQL and run:

```sql
source backend/database.sql;
```

Or copy all SQL from `backend/database.sql` and run it in MySQL Workbench/phpMyAdmin.

## Setup Step 2: Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

For Mac/Linux, use:

```bash
cp .env.example .env
```

Edit `.env` and set your MySQL password:

```env
DB_PASSWORD=your_mysql_password
JWT_SECRET=change_this_to_a_long_secret_key
```

Backend runs on:

```text
http://localhost:5000
```

## Setup Step 3: Create Admin Account

After backend setup and database connection:

```bash
cd backend
npm run create-admin
```

Default admin login:

```text
Email: admin@example.com
Password: admin12345
```

You can also register admin from frontend using admin secret from `.env`:

```text
admin123
```

## Setup Step 4: Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## How It Works

1. User registers as job seeker, employer, or admin.
2. Backend hashes password using bcrypt and stores user in MySQL.
3. On login, backend returns a JWT token.
4. Frontend stores token in localStorage.
5. Every protected API request sends token in Authorization header.
6. Backend checks token and user role.
7. Job seeker can apply for jobs.
8. Employer can post jobs and manage applicants.
9. Admin can manage all users, jobs, and applications.

## AI Prompt Used to Generate/Extend This Project

```text
Create a full-stack beginner-friendly Job Seeking Website using React, Node.js, Express, and MySQL. The project must include separate frontend components and backend modules. Add role-based authentication using JWT with three roles: job_seeker, employer, and admin. Build separate dashboards for each role. Job seekers can browse jobs, view job details, apply with a cover letter, and track application status. Employers can create job posts, view their jobs, view applicants, and update application status. Admin can manage users, jobs, applications, and view platform statistics. Use a premium, modern, attractive UI with animated cards, responsive design, and clean CSS. Keep code easy to understand for beginners. Provide complete setup steps, database schema, API routes, frontend routes, and separate code files for components, pages, controllers, routes, middleware, and database config.
```

## Important Notes

This is an MVP project for learning and portfolio use. For production, add email verification, forgot password, resume upload, pagination, server-side filtering, validation library, rate limiting, and deployment security.

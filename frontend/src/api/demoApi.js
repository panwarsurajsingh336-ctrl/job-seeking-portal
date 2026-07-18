const STORE_KEY = 'hirevyom_demo_data';
const TOKEN_KEY = 'job_portal_token';

const seed = {
  users: [
    { id: 1, name: 'Demo Employer', email: 'employer@demo.com', password: 'demo123', role: 'employer', company_name: 'HireVyom Labs' },
    { id: 2, name: 'Demo Seeker', email: 'seeker@demo.com', password: 'demo123', role: 'job_seeker', company_name: null },
    { id: 3, name: 'Demo Admin', email: 'admin@demo.com', password: 'demo123', role: 'admin', company_name: null }
  ],
  jobs: [
    { id: 1, title: 'Frontend Developer', description: 'Build responsive product experiences with React and modern CSS.', location: 'Bengaluru, India', job_type: 'Hybrid', salary: '5 LPA - 8 LPA', skills: 'React, JavaScript, CSS', employer_id: 1, company_name: 'HireVyom Labs', status: 'open', created_at: new Date().toISOString() },
    { id: 2, title: 'Node.js Developer', description: 'Develop reliable APIs and collaborate with frontend engineers.', location: 'Pune, India', job_type: 'Remote', salary: '6 LPA - 10 LPA', skills: 'Node.js, Express, MySQL', employer_id: 1, company_name: 'HireVyom Labs', status: 'open', created_at: new Date().toISOString() },
    { id: 3, title: 'UI/UX Intern', description: 'Help design clean, accessible interfaces for web applications.', location: 'Delhi, India', job_type: 'Internship', salary: '₹20,000/month', skills: 'Figma, UI Design, Prototyping', employer_id: 1, company_name: 'HireVyom Labs', status: 'open', created_at: new Date().toISOString() }
  ],
  applications: []
};

const read = () => {
  const stored = localStorage.getItem(STORE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORE_KEY, JSON.stringify(seed));
  return structuredClone(seed);
};

const write = (data) => localStorage.setItem(STORE_KEY, JSON.stringify(data));
const response = (data) => Promise.resolve({ data });
const failure = (message) => Promise.reject({ response: { data: { message } } });
const publicUser = ({ password, ...user }) => user;
const currentUser = (data) => {
  const id = Number(localStorage.getItem(TOKEN_KEY));
  return data.users.find((user) => user.id === id);
};
const nextId = (items) => Math.max(0, ...items.map((item) => item.id)) + 1;
const enrichJob = (job, data) => ({
  ...job,
  company_name: data.users.find((user) => user.id === job.employer_id)?.company_name || job.company_name || 'Company'
});
const enrichApplication = (application, data) => {
  const job = data.jobs.find((item) => item.id === application.job_id) || {};
  const seeker = data.users.find((item) => item.id === application.seeker_id) || {};
  return { ...application, title: job.title, location: job.location, company_name: enrichJob(job, data).company_name, seeker_name: seeker.name, seeker_email: seeker.email };
};

const demoApi = {
  async get(url) {
    const data = read();
    const user = currentUser(data);

    if (url === '/auth/me') return user ? response(publicUser(user)) : failure('Please log in.');
    if (url === '/jobs') return response(data.jobs.filter((job) => job.status === 'open').map((job) => enrichJob(job, data)));
    if (url === '/jobs/employer/my') {
      const jobs = data.jobs.filter((job) => job.employer_id === user?.id).map((job) => ({ ...enrichJob(job, data), application_count: data.applications.filter((app) => app.job_id === job.id).length }));
      return response(jobs);
    }
    if (url === '/applications/my') return response(data.applications.filter((app) => app.seeker_id === user?.id).map((app) => enrichApplication(app, data)));
    if (url === '/applications/employer') {
      return response(data.applications.filter((app) => data.jobs.some((job) => job.id === app.job_id && job.employer_id === user?.id)).map((app) => enrichApplication(app, data)));
    }
    if (url === '/admin/stats') return response({ users: data.users.length, jobs: data.jobs.length, applications: data.applications.length, openJobs: data.jobs.filter((job) => job.status === 'open').length });
    if (url === '/admin/users') return response(data.users.map(publicUser));
    if (url === '/admin/jobs') return response(data.jobs.map((job) => enrichJob(job, data)));
    if (url === '/admin/applications') return response(data.applications.map((app) => enrichApplication(app, data)));
    if (url.startsWith('/jobs/')) {
      const job = data.jobs.find((item) => item.id === Number(url.split('/').pop()));
      return job ? response(enrichJob(job, data)) : failure('Job not found.');
    }
    return failure('Demo route not found.');
  },

  async post(url, payload) {
    const data = read();

    if (url === '/auth/register') {
      if (data.users.some((user) => user.email.toLowerCase() === payload.email.toLowerCase())) return failure('Email is already registered.');
      const user = { id: nextId(data.users), name: payload.name, email: payload.email, password: payload.password, role: payload.role, company_name: payload.company_name || null };
      data.users.push(user);
      write(data);
      localStorage.setItem(TOKEN_KEY, String(user.id));
      return response({ token: String(user.id), user: publicUser(user) });
    }
    if (url === '/auth/login') {
      const user = data.users.find((item) => item.email.toLowerCase() === payload.email.toLowerCase() && item.password === payload.password);
      if (!user) return failure('Invalid email or password.');
      localStorage.setItem(TOKEN_KEY, String(user.id));
      return response({ token: String(user.id), user: publicUser(user) });
    }
    if (url === '/jobs') {
      const user = currentUser(data);
      const job = { ...payload, id: nextId(data.jobs), employer_id: user.id, company_name: user.company_name, status: 'open', created_at: new Date().toISOString() };
      data.jobs.push(job);
      write(data);
      return response(job);
    }
    if (url.startsWith('/applications/apply/')) {
      const user = currentUser(data);
      const jobId = Number(url.split('/').pop());
      if (data.applications.some((app) => app.job_id === jobId && app.seeker_id === user.id)) return failure('You already applied for this job.');
      data.applications.push({ id: nextId(data.applications), job_id: jobId, seeker_id: user.id, cover_letter: payload.cover_letter, status: 'pending', created_at: new Date().toISOString() });
      write(data);
      return response({ message: 'Application submitted successfully.' });
    }
    return failure('Demo route not found.');
  },

  async put(url, payload) {
    const data = read();
    const id = Number(url.split('/').filter(Boolean).at(-2) || url.split('/').pop());

    if (/^\/jobs\/\d+$/.test(url) || /^\/admin\/jobs\/\d+$/.test(url)) {
      const jobId = Number(url.split('/').pop());
      data.jobs = data.jobs.map((job) => job.id === jobId ? { ...job, ...payload, id: job.id } : job);
    } else if (url.includes('/applications/')) {
      data.applications = data.applications.map((app) => app.id === id ? { ...app, status: payload.status } : app);
    }
    write(data);
    return response({ message: 'Updated successfully.' });
  },

  async delete(url) {
    const data = read();
    const id = Number(url.split('/').pop());
    if (url.includes('/users/')) data.users = data.users.filter((user) => user.id !== id);
    if (url.includes('/jobs/')) {
      data.jobs = data.jobs.filter((job) => job.id !== id);
      data.applications = data.applications.filter((app) => app.job_id !== id);
    }
    write(data);
    return response({ message: 'Deleted successfully.' });
  }
};

export default demoApi;

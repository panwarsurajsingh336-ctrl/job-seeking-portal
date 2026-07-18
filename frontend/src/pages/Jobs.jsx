import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/api.js';
import JobCard from '../components/JobCard.jsx';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [jobMode, setJobMode] = useState('All');
  const [city, setCity] = useState('All');
  const [salaryRange, setSalaryRange] = useState('All');
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    try {
      const { data } = await api.get('/jobs');
      setJobs(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const getSalaryNumber = (salary = '') => {
    const numbers = salary.match(/\d+/g);
    if (!numbers) return 0;
    const largest = Math.max(...numbers.map(Number));
    return /lpa|lac|lakh/i.test(salary) ? largest * 100000 : largest;
  };

  const categoryOptions = useMemo(() => {
    const categories = jobs
      .flatMap((job) => [job.title, job.skills])
      .filter(Boolean)
      .flatMap((value) => value.split(','))
      .map((value) => value.trim())
      .filter(Boolean);

    return ['All', ...new Set(categories)].slice(0, 12);
  }, [jobs]);

  const modeOptions = useMemo(() => {
    const modes = jobs.map((job) => job.job_type).filter(Boolean);
    return ['All', ...new Set(modes)];
  }, [jobs]);

  const cityOptions = useMemo(() => {
    const cities = jobs
      .map((job) => job.location)
      .filter(Boolean)
      .map((location) => location.split(',')[0].trim());

    return ['All', ...new Set(cities)];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const text = `${job.title} ${job.location} ${job.skills} ${job.company_name} ${job.job_type}`.toLowerCase();
      const salary = getSalaryNumber(job.salary || '');
      const cityName = job.location?.split(',')[0].trim();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesCategory =
        category === 'All' || `${job.title} ${job.skills}`.toLowerCase().includes(category.toLowerCase());
      const matchesMode = jobMode === 'All' || job.job_type === jobMode;
      const matchesCity = city === 'All' || cityName === city;
      const matchesSalary =
        salaryRange === 'All' ||
        (salaryRange === '0-300000' && salary <= 300000) ||
        (salaryRange === '300000-800000' && salary > 300000 && salary <= 800000) ||
        (salaryRange === '800000+' && salary > 800000);

      return matchesSearch && matchesCategory && matchesMode && matchesCity && matchesSalary;
    });
  }, [jobs, search, category, jobMode, city, salaryRange]);

  return (
    <main className="page-wrap">
      <section className="section-heading left">
        <span className="eyebrow">Open positions</span>
        <h1>Find your next opportunity</h1>
        <div className="job-toolbar">
          <input
            className="search-input"
            placeholder="Search by title, skills, company or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="filter-grid">
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categoryOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
            <select value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)}>
              <option value="All">Any salary</option>
              <option value="0-300000">Up to 3 LPA</option>
              <option value="300000-800000">3 LPA to 8 LPA</option>
              <option value="800000+">Above 8 LPA</option>
            </select>
            <select value={jobMode} onChange={(e) => setJobMode(e.target.value)}>
              {modeOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              {cityOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        </div>
        <p className="result-count">
          {filteredJobs.length} current job opening{filteredJobs.length === 1 ? '' : 's'} found
        </p>
      </section>

      {loading ? (
        <div className="loader">Loading jobs...</div>
      ) : (
        <div className="job-grid">
          {filteredJobs.map((job, index) => <JobCard key={job.id} job={job} featured={index < 3} />)}
          {filteredJobs.length === 0 && <p>No jobs found.</p>}
        </div>
      )}
    </main>
  );
};

export default Jobs;

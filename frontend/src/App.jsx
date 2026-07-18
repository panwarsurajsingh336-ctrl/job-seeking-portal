import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Jobs from './pages/Jobs.jsx';
import JobDetails from './pages/JobDetails.jsx';
import SeekerDashboard from './pages/SeekerDashboard.jsx';
import MyApplications from './pages/MyApplications.jsx';
import EmployerDashboard from './pages/EmployerDashboard.jsx';
import PostJob from './pages/PostJob.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        <Route
          path="/seeker"
          element={
            <ProtectedRoute roles={["job_seeker"]}>
              <SeekerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute roles={["job_seeker"]}>
              <MyApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer"
          element={
            <ProtectedRoute roles={["employer"]}>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-job"
          element={
            <ProtectedRoute roles={["employer"]}>
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-job/:id"
          element={
            <ProtectedRoute roles={["employer"]}>
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
};

export default App;

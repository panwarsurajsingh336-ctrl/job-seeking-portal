import express from 'express';
import {
  deleteUser,
  getAdminStats,
  getAllApplicationsAdmin,
  getAllJobsAdmin,
  getAllUsers
} from '../controllers/adminController.js';
import { allowRoles, protect } from '../middleware/authMiddleware.js';
import { deleteJob, updateJob } from '../controllers/jobController.js';
import { updateApplicationStatus } from '../controllers/applicationController.js';

const router = express.Router();

router.use(protect, allowRoles('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/jobs', getAllJobsAdmin);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);
router.get('/applications', getAllApplicationsAdmin);
router.put('/applications/:id/status', updateApplicationStatus);

export default router;

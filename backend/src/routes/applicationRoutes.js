import express from 'express';
import {
  applyForJob,
  getApplicationsForEmployer,
  getMyApplications,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { allowRoles, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply/:jobId', protect, allowRoles('job_seeker'), applyForJob);
router.get('/my', protect, allowRoles('job_seeker'), getMyApplications);
router.get('/employer', protect, allowRoles('employer'), getApplicationsForEmployer);
router.put('/:id/status', protect, allowRoles('employer', 'admin'), updateApplicationStatus);

export default router;

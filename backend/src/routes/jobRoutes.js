import express from 'express';
import {
  createJob,
  deleteJob,
  getAllJobs,
  getEmployerJobs,
  getJobById,
  updateJob
} from '../controllers/jobController.js';
import { allowRoles, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllJobs);
router.get('/employer/my', protect, allowRoles('employer'), getEmployerJobs);
router.get('/:id', getJobById);
router.post('/', protect, allowRoles('employer'), createJob);
router.put('/:id', protect, allowRoles('employer', 'admin'), updateJob);
router.delete('/:id', protect, allowRoles('employer', 'admin'), deleteJob);

export default router;

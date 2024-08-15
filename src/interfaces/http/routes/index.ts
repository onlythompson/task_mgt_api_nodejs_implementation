import express from 'express';
import { container } from '../../../container';
import { createAuthMiddleware } from '../middlewares/authMiddleware';

import taskRoutes from './taskRoutes';
import authRoutes from './authRoutes';

const router = express.Router();

const authMiddleware = createAuthMiddleware(container);

router.use('/api', authRoutes);
// router.use('/api/task', taskRoutes);
export default router;
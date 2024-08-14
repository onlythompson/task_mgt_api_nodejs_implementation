import express from 'express';
import { container } from '../../../container';
import { createAuthMiddleware } from '../middlewares/authMiddleware';

import taskRoutes from './taskRoutes';

const router = express.Router();

// const authMiddleware = createAuthMiddleware(container);

// router.use('/', userRoutes);
// router.use('/task', authMiddleware, taskRoutes);
router.use('/task', taskRoutes);
export default router;
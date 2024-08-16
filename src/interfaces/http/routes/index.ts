import express from 'express';
import { container } from '../../../container';
import { createAuthMiddleware } from '../middlewares/authMiddleware';
import { AuthenticationController } from '../controllers/AuthenticationController';
import { TaskController } from '../controllers/TaskController';
import createTaskRoutes from './taskRoutes';
import createAuthRoutes from './authRoutes';


const router = express.Router();

const authMiddleware = createAuthMiddleware(container);

const authController = container.resolve(AuthenticationController);
const taskController = container.resolve(TaskController);

router.use('/auth', createAuthRoutes(authController));
router.use('/task', authMiddleware, createTaskRoutes(taskController));

export default router;
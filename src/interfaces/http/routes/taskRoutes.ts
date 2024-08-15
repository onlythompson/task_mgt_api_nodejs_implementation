import express, { Router } from 'express';
import { container } from '../../../container'
import { TaskController } from '../controllers/TaskController';
import { validate } from '../middlewares/validationMiddleware';
import { taskValidations } from '../validations/taskValidations';



const router = Router();
const taskController = container.resolve(TaskController);

  /**
   * @swagger
   * components:
   *   schemas:
   *     Task:
   *       type: object
   *       required:
   *         - id
   *         - title
   *         - description
   *         - status
   *         - priority
   *         - dueDate
   *         - category
   *       properties:
   *         id:
   *           type: string
   *         title:
   *           type: string
   *         description:
   *           type: string
   *         status:
   *           type: string
   *           enum: [TODO, IN_PROGRESS, DONE]
   *         priority:
   *           type: string
   *           enum: [LOW, MEDIUM, HIGH]
   *         dueDate:
   *           type: string
   *           format: date-time
   *         category:
   *           type: string
   *         createdAt:
   *           type: string
   *           format: date-time
   *         updatedAt:
   *           type: string
   *           format: date-time
   *     
   *     CreateTaskRequest:
   *       type: object
   *       required:
   *         - title
   *         - description
   *         - dueDate
   *         - category
   *       properties:
   *         title:
   *           type: string
   *         description:
   *           type: string
   *         dueDate:
   *           type: string
   *           format: date-time
   *         category:
   *           type: string
   *         priority:
   *           type: string
   *           enum: [LOW, MEDIUM, HIGH]
   *     
   *     UpdateTaskRequest:
   *       type: object
   *       properties:
   *         title:
   *           type: string
   *         description:
   *           type: string
   *         status:
   *           type: string
   *           enum: [TODO, IN_PROGRESS, DONE]
   *         priority:
   *           type: string
   *           enum: [LOW, MEDIUM, HIGH]
   *         dueDate:
   *           type: string
   *           format: date-time
   *         category:
   *           type: string
   */

  /**
   * @swagger
   * /tasks:
   *   post:
   *     summary: Create a new task
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateTaskRequest'
   *     responses:
   *       201:
   *         description: Created task
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Task'
   *       400:
   *         description: Invalid input
   *       401:
   *         description: Unauthorized
   */
  router.post(
    '/',
    validate(taskValidations.createTask),
    (req, res) => taskController.createTask(req, res)
      .then(task => res.status(201).json(task))
      .catch(err => res.status(400).json({ error: err.message }))
  );

  /**
   * @swagger
   * /tasks/{id}:
   *   put:
   *     summary: Update a task
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateTaskRequest'
   *     responses:
   *       200:
   *         description: Updated task
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Task'
   *       400:
   *         description: Invalid input
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Task not found
   */
  router.put(
    '/:id',
    validate(taskValidations.updateTask),
    (req, res) => taskController.updateTask(req, res)
      .then(task => res.json(task))
      .catch(err => res.status(err.message === 'Task not found' ? 404 : 400).json({ error: err.message }))
  );

  /**
   * @swagger
   * /tasks/{id}:
   *   get:
   *     summary: Get a task by ID
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Task details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Task'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Task not found
   */
  router.get(
    '/:id',
    validate(taskValidations.taskId),
    (req, res) => taskController.getTask(req, res)
  );

  /**
   * @swagger
   * /tasks:
   *   get:
   *     summary: Get all tasks for the current user
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of tasks
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Task'
   *       401:
   *         description: Unauthorized
   */
  router.get(
    '/',
    (req, res) => taskController.getUserTasks(req, res)
  );

  /**
   * @swagger
   * /tasks/category/{category}:
   *   get:
   *     summary: Get all tasks for a specific category
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: category
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of tasks
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Task'
   *       401:
   *         description: Unauthorized
   */
  router.get(
    '/category/:category',
    validate(taskValidations.category),
    (req, res) => taskController.getCategoryTasks(req, res)
  );

  /**
   * @swagger
   * /tasks/user-category/{category}:
   *   get:
   *     summary: Get all tasks for the current user in a specific category
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: category
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of tasks
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Task'
   *       401:
   *         description: Unauthorized
   */
  router.get(
    '/user-category/:category',
    validate(taskValidations.category),
    (req, res) => taskController.getUserCategoryTasks(req, res)
  );

  /**
   * @swagger
   * /tasks/{id}:
   *   delete:
   *     summary: Delete a task
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Task deleted successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Task not found
   */
  router.delete(
    '/:id',
    validate(taskValidations.taskId),
    (req, res) => taskController.deleteTask(req, res)
  );

  /**
   * @swagger
   * /tasks/{id}/complete:
   *   patch:
   *     summary: Mark a task as completed
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Updated task
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Task'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Task not found
   */
  router.patch(
    '/:id/complete',
    validate(taskValidations.taskId),
    (req, res) => taskController.markTaskAsCompleted(req, res)
      
  );

export default router;



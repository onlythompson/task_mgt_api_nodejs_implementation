import { body, param } from 'express-validator';
import { TaskStatus, TaskPriority } from '../../../domain/task';

export const taskValidations = {
  createTask: [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('dueDate').isISO8601().toDate().withMessage('Valid due date is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('priority').optional().isIn(Object.values(TaskPriority)).withMessage('Invalid priority')
  ],

  updateTask: [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('status').optional().isIn(Object.values(TaskStatus)).withMessage('Invalid status'),
    body('priority').optional().isIn(Object.values(TaskPriority)).withMessage('Invalid priority'),
    body('dueDate').optional().isISO8601().toDate().withMessage('Invalid due date'),
    body('category').optional().notEmpty().withMessage('Category cannot be empty')
  ],

  taskId: [
    param('id').notEmpty().withMessage('Task ID is required')
  ],

  category: [
    param('category').notEmpty().withMessage('Category is required')
  ]
};
/**
 * TaskController.ts
 * 
 * This file contains the TaskController class, which handles HTTP requests
 * related to task management. It utilizes various use cases to perform
 * operations on tasks and uses TaskSerializer for data transformation.
 */

import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import {
    CreateTaskUseCase,
    GetTaskByIdUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    GetTasksByUserUseCase,
    GetTasksByCategoryUseCase,
    GetTasksByUserAndCategoryUseCase,
    MarkTaskAsCompletedUseCase
} from '../../../application/use-cases';
import { Category } from '../../../domain/task';
import { CreateTaskSerializer, TaskListItemSerializer, TaskResponseSerializer, UpdateTaskSerializer } from '../../serializers/TaskSerializer';
import { User } from '../../../domain/user';

// Define a custom interface extending Express.Request
interface AuthenticatedRequest extends Request {
    user?: User;
  }
@injectable()
export class TaskController {
    constructor(
        @inject(CreateTaskUseCase) private createTaskUseCase: CreateTaskUseCase,
        @inject(UpdateTaskUseCase) private updateTaskUseCase: UpdateTaskUseCase,
        @inject(GetTaskByIdUseCase) private getTaskByIdUseCase: GetTaskByIdUseCase,
        @inject(GetTasksByUserUseCase) private getTasksByUserUseCase: GetTasksByUserUseCase,
        @inject(GetTasksByCategoryUseCase) private getTasksByCategoryUseCase: GetTasksByCategoryUseCase,
        @inject(GetTasksByUserAndCategoryUseCase) private getTasksByUserAndCategoryUseCase: GetTasksByUserAndCategoryUseCase,
        @inject(DeleteTaskUseCase) private deleteTaskUseCase: DeleteTaskUseCase,
        @inject(MarkTaskAsCompletedUseCase) private markTaskAsCompletedUseCase: MarkTaskAsCompletedUseCase
    ) { }

    /**
     * Creates a new task.
     * 
     * @param req - The request object containing task data in the body and user ID in the user property.
     * @param res - The response object used to send the created task or error.
     * 
     * @throws 400 - If the task data is invalid or incomplete.
     * @throws 500 - If there's an internal server error during task creation.
     * 
     * @returns A Promise resolving to void. The response is sent directly through the res object.
     */
    async createTask(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.getId();
            if (!userId) {
                res.status(400).json({ message: 'User ID is missing' });
                return;
            }
            const category = new Category(req.body.category);
            const taskData = CreateTaskSerializer.deserialize(req.body, userId, category);
            const createdTask = await this.createTaskUseCase.execute(
                taskData.getTitle(),
                taskData.getDescription(),
                taskData.getDueDate(),
                userId,
                category,
                taskData.getPriority()
            );
            res.status(201).json(TaskResponseSerializer.serialize(createdTask));
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: error });
            }
        }
    }

    /**
     * Updates an existing task.
     * 
     * @param req - The request object containing task ID in params and update data in the body.
     * @param res - The response object used to send the updated task or error.
     * 
     * @throws 400 - If the update data is invalid.
     * @throws 404 - If the task to be updated is not found.
     * @throws 500 - If there's an internal server error during task update.
     * 
     * @returns A Promise resolving to void. The response is sent directly through the res object.
     */
    async updateTask(req: Request, res: Response): Promise<void> {
        try {
            const taskId = req.params.id;
            const existingTask = await this.getTaskByIdUseCase.execute(taskId);
            if (!existingTask) {
                res.status(404).json({ error: 'Task not found' });
                return;
            }
            const category = new Category(req.body.category);
            const updatedTaskData = UpdateTaskSerializer.deserialize(existingTask, req.body, category);
            const updatedTask = await this.updateTaskUseCase.execute(taskId, {
                setTitle: updatedTaskData.getTitle(),
                setDescription: updatedTaskData.getDescription(),
                setStatus: updatedTaskData.getStatus(),
                setPriority: updatedTaskData.getPriority(),
                setCategory: updatedTaskData.getCategory(),
                setDueDate: updatedTaskData.getDueDate()
            });
            res.json(TaskResponseSerializer.serialize(updatedTask));
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: error });
            }

        }
    }

    /**
     * Retrieves a task by its ID.
     * 
     * @param req - The request object containing the task ID in params.
     * @param res - The response object used to send the task or error.
     * 
     * @throws 404 - If the task is not found.
     * @throws 500 - If there's an internal server error during task retrieval.
     * 
     * @returns A Promise resolving to void. The response is sent directly through the res object.
     */
    async getTask(req: Request, res: Response): Promise<void> {
        try {
            const taskId = req.params.id;
            const task = await this.getTaskByIdUseCase.execute(taskId);
            if (!task) {
                res.status(404).json({ error: 'Task not found' });
                return;
            }
            res.json(TaskResponseSerializer.serialize(task));
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: error });
            }
        }
    }

    /**
     * Retrieves all tasks for the current user.
     * 
     * @param req - The request object containing the user ID in the user property.
     * @param res - The response object used to send the tasks or error.
     * 
     * @throws 500 - If there's an internal server error during task retrieval.
     * 
     * @returns A Promise resolving to void. The response is sent directly through the res object.
     */
    async getUserTasks(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.getId();
            if (!userId) {
                res.status(400).json({ message: 'User ID is missing' });
                return;
            }

            const tasks = await this.getTasksByUserUseCase.execute(userId);
            res.json(TaskListItemSerializer.serializeMany(tasks));
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
            res.status(500).json({ error: error });
            }
        }
    }

    /**
     * Retrieves all tasks for a specific category.
     * 
     * @param req - The request object containing the category name in params.
     * @param res - The response object used to send the tasks or error.
     * 
     * @throws 500 - If there's an internal server error during task retrieval.
     * 
     * @returns A Promise resolving to void. The response is sent directly through the res object.
     */
    async getCategoryTasks(req: Request, res: Response): Promise<void> {
        try {
            const categoryName = req.params.category;
            const category = new Category(categoryName);
            const tasks = await this.getTasksByCategoryUseCase.execute(category);
            res.json(TaskListItemSerializer.serializeMany(tasks));
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
            res.status(500).json({ error: error});
            }
        }
    }

    /**
     * Retrieves all tasks for the current user in a specific category.
     * 
     * @param req - The request object containing the user ID in the user property and category name in params.
     * @param res - The response object used to send the tasks or error.
     * 
     * @throws 500 - If there's an internal server error during task retrieval.
     * 
     * @returns A Promise resolving to void. The response is sent directly through the res object.
     */
    async getUserCategoryTasks(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.getId();
            if (!userId) {
                res.status(400).json({ message: 'User ID is missing' });
                return;
            }
    
            const categoryName = req.params.category;
            const category = new Category(categoryName);
            const tasks = await this.getTasksByUserAndCategoryUseCase.execute(userId, category);
            res.json(TaskListItemSerializer.serializeMany(tasks));
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
            res.status(500).json({ error: error });
            }
        }
    }

    /**
     * Deletes a task by its ID.
     * 
     * @param req - The request object containing the task ID in params.
     * @param res - The response object used to send the success status or error.
     * 
     * @throws 500 - If there's an internal server error during task deletion.
     * 
     * @returns A Promise resolving to void. The response is sent directly through the res object.
     */
    async deleteTask(req: Request, res: Response): Promise<void> {
        try {
            const taskId = req.params.id;
            await this.deleteTaskUseCase.execute(taskId);
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: error });
            }
        }
    }

    /**
     * Marks a task as completed.
     * 
     * @param req - The request object containing the task ID in params.
     * @param res - The response object used to send the updated task or error.
     * 
     * @throws 404 - If the task to be marked as completed is not found.
     * @throws 500 - If there's an internal server error during the operation.
     * 
     * @returns A Promise resolving to void. The response is sent directly through the res object.
     */
    async markTaskAsCompleted(req: Request, res: Response): Promise<void> {
        try {
            const taskId = req.params.id;
            const updatedTask = await this.markTaskAsCompletedUseCase.execute(taskId);
            res.json(TaskResponseSerializer.serialize(updatedTask));
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Task not found') {
                    res.status(404).json({ error: error.message });
                } else {
                    res.status(500).json({ error: error.message });
                }
            } else {
                res.status(500).json({ error: error });
            }
        }
    }
}
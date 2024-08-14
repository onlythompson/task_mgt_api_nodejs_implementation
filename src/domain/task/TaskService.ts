/**
 * TaskService.ts
 * 
 * This file defines the TaskService class for the task management system.
 * It encapsulates the business logic for task-related operations.
 * 
 * @module TaskService
 */

import { injectable, inject } from 'tsyringe';
import { Task } from './Task';
import { Category } from './Category';
import { TaskRepository } from './TaskRepository';
import { TaskFactory } from './TaskFactory';
import { TaskPriority, TaskStatus } from './TaskEnum';

/**
 * Service class for managing tasks in the system.
 * 
 * @class TaskService
 */
@injectable()
export class TaskService {
  /**
   * Creates an instance of TaskService.
   * 
   * @constructor
   * @param {ITaskRepository} taskRepository - The task repository for data access.
   */
  constructor(
    @inject("TaskRepository") private taskRepository: TaskRepository,
    @inject(TaskFactory) private taskFactory: TaskFactory
  ) { }

  /**
  * Creates a new task.
  * 
  * @param {string} title - The title of the task.
  * @param {string} description - The description of the task.
  * @param {Date} dueDate - The due date of the task.
  * @param {string} createdByUserId - The ID of the user creating the task.
  * @param {Category} category - The category of the task.
  * @param {TaskPriority} [priority=TaskPriority.MEDIUM] - The priority of the task.
  * @returns {Promise<Task>} A promise that resolves to the created Task.
  */
  async createTask(
    title: string,
    description: string,
    dueDate: Date,
    createdByUserId: string,
    category: Category,
    priority: TaskPriority = TaskPriority.MEDIUM
  ): Promise<Task> {
    const newTask = this.taskFactory.createTask(
      title,
      description,
      dueDate,
      createdByUserId,
      category,
      priority
    );
    return this.taskRepository.save(newTask);
  }

  /**
   * Updates an existing task.
   * 
   * @param {string} id - The ID of the task to update.
   * @param {Partial<Task>} updates - The properties of the task to update.
   * @returns {Promise<Task>} A promise that resolves to the updated Task.
   * @throws {Error} If the task is not found.
   */
  async updateTask(id: string, updates: Partial<{
    setTitle: string;
    setDescription: string;
    setStatus: TaskStatus;
    setPriority: TaskPriority;
    setCategory: Category;
    setDueDate: Date;
  }>): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }

    if (updates.setTitle) task.setTitle(updates.setTitle);
    if (updates.setDescription) task.setDescription(updates.setDescription);
    if (updates.setStatus) task.setStatus(updates.setStatus);
    if (updates.setPriority) task.setPriority(updates.setPriority);
    if (updates.setCategory) task.setCategory(updates.setCategory);
    if (updates.setDueDate) task.setDueDate(updates.setDueDate);
    
    return this.taskRepository.save(task);
  }

  /**
   * Deletes a task.
   * 
   * @param {string} id - The ID of the task to delete.
   * @returns {Promise<void>} A promise that resolves when the task is deleted.
   */
  async deleteTask(id: string): Promise<void> {
    return this.taskRepository.delete(id);
  }

  /**
   * Retrieves a task by its ID.
   * 
   * @param {string} id - The ID of the task to retrieve.
   * @returns {Promise<Task | null>} A promise that resolves to the Task or null if not found.
   */
  async getTaskById(id: string): Promise<Task | null> {
    return this.taskRepository.findById(id);
  }

  /**
   * Retrieves all tasks for a specific user.
   * 
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Task[]>} A promise that resolves to an array of Tasks.
   */
  async getTasksByUser(userId: string): Promise<Task[]> {
    return this.taskRepository.findByUser(userId);
  }

  /**
  * Retrieves all tasks in a specific category for a specific user.
  * 
  * @param {string} userId - The ID of the user.
  * @param {Category} category - The category to filter by.
  * @returns {Promise<Task[]>} A promise that resolves to an array of Tasks.
  */
  async getTasksByUserAndCategory(userId: string, category: Category): Promise<Task[]> {
    return this.taskRepository.findByCategoryAndUser(userId, category);
  }


  /**
   * Retrieves all tasks in a specific category.
   * 
   * @param {Category} category - The category to filter by.
   * @returns {Promise<Task[]>} A promise that resolves to an array of Tasks.
   */
  async getTasksByCategory(category: Category): Promise<Task[]> {
    return this.taskRepository.findByCategory(category);
  }

  /**
   * Retrieves all tasks.
   * 
   * @returns {Promise<Task[]>} A promise that resolves to an array of all Tasks.
   */
  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }
}
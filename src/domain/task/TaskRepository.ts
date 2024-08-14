/**
 * TaskRepository.ts
 * 
 * This file defines the TaskRepository interface for the task management system.
 * It provides methods for persisting and retrieving Task entities.
 * 
 * @module TaskRepository
 */

import { Task } from './Task';
import { Category } from './Category';

/**
 * Represents the interface for Task data access operations.
 * 
 * @interface TaskRepository
 */
export interface TaskRepository {
  /**
   * Retrieves a task by its unique identifier.
   * 
   * @param {string} id - The unique identifier of the task.
   * @returns {Promise<Task | null>} A promise that resolves to the found Task or null if not found.
   */
  findById(id: string): Promise<Task | null>;

  /**
   * Retrieves all tasks created by a specific user.
   * 
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<Task[]>} A promise that resolves to an array of Tasks.
   */
  findByUser(userId: string): Promise<Task[]>;

   /**
   * Retrieves all tasks in a specific category for a specific user.
   * 
   * @param {string} userId - The unique identifier of the user.
   * @param {Category} category - The category to filter by.
   * @returns {Promise<Task[]>} A promise that resolves to an array of Tasks.
   */
   findByCategoryAndUser(userId: string, category: Category): Promise<Task[]>;

  /**
   * Retrieves all tasks in a specific category.
   * 
   * @param {Category} category - The category to filter by.
   * @returns {Promise<Task[]>} A promise that resolves to an array of Tasks.
   */
  findByCategory(category: Category): Promise<Task[]>;

  /**
   * Saves a new task or updates an existing one.
   * 
   * @param {Task} task - The task to save or update.
   * @returns {Promise<Task>} A promise that resolves to the saved Task.
   */
  save(task: Task): Promise<Task>;

  /**
   * Deletes a task by its unique identifier.
   * 
   * @param {string} id - The unique identifier of the task to delete.
   * @returns {Promise<void>} A promise that resolves when the task is deleted.
   */
  delete(id: string): Promise<void>;

  /**
   * Retrieves all tasks.
   * 
   * @returns {Promise<Task[]>} A promise that resolves to an array of all Tasks.
   */
  findAll(): Promise<Task[]>;
}
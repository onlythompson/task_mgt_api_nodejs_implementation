/**
 * TaskFactory.ts
 * 
 * This file defines the TaskFactory class for the task management system.
 * The TaskFactory is responsible for creating Task instances, encapsulating
 * the creation logic and applying any necessary business rules.
 * 
 * @module TaskFactory
 */

import { injectable } from 'tsyringe';
import { Task } from './Task';
import { Category } from './Category';
import { TaskPriority, TaskStatus } from './TaskEnum';

/**
 * Factory class for creating Task instances.
 * 
 * @class TaskFactory
 */
@injectable()
export class TaskFactory {
  /**
   * Creates a new Task instance.
   * 
   * @param {string} title - The title of the task.
   * @param {string} description - The description of the task.
   * @param {Date} dueDate - The due date of the task.
   * @param {string} createdByUserId - The ID of the user creating the task.
   * @param {Category} category - The category of the task.
   * @param {TaskPriority} [priority=TaskPriority.MEDIUM] - The priority of the task.
   * @returns {Task} A new Task instance.
   */
  createTask(
    title: string,
    description: string,
    dueDate: Date,
    createdByUserId: string,
    category: Category,
    priority: TaskPriority = TaskPriority.MEDIUM
  ): Task {
    // Validate input
    this.validateTaskInput(createdByUserId, title, description, dueDate);

    // Create and return the new Task
    return new Task(
      this.generateTaskId(),
      title.trim(),
      description.trim(),
      TaskStatus.TODO,  // New tasks always start with TODO status
      priority,
      dueDate,
      createdByUserId,
      category,
      new Date(),  // createdAt
      new Date()   // updatedAt
    );
  }

  /**
   * Validates the input for creating a task.
   * 
   * @private
   * @param {string} title - The title of the task.
   * @param {string} description - The description of the task.
   * @param {Date} dueDate - The due date of the task.
   * @throws {Error} If any of the inputs are invalid.
   */
  private validateTaskInput(createdByUserId: string, title: string, description: string, dueDate: Date): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Task title cannot be empty');
    }
    if (!description || description.trim().length === 0) {
      throw new Error('Task description cannot be empty');
    }
    if (!(dueDate instanceof Date) || isNaN(dueDate.getTime())) {
      throw new Error('Invalid due date');
    }
    if (dueDate < new Date()) {
      throw new Error('Due date cannot be in the past');
    }

    if (!createdByUserId || createdByUserId.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }

  }

  /**
   * Generates a unique ID for a task.
   * 
   * @private
   * @returns {string} A unique task ID.
   */
  private generateTaskId(): string {
    // In a real-world scenario, you might want to use a more robust ID generation method
    // For example, you could use a UUID library
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
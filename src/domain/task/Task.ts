/**
 * 
 * This file defines the Task entity for the task management system.
 * Tasks represent individual items of work that need to be completed.
 * 
 * @module Task
 */

import { Category } from './Category';
import { TaskPriority, TaskStatus } from './TaskEnum';



/**
 * Represents a task in the task management system.
 * 
 * Tasks are the core entities in the system, representing individual items of work
 * that need to be completed. Each task has properties such as a title, description,
 * status, priority, due date, category, and associated metadata.
 * 
 * @class Task
 */
export class Task {
  /**
   * Creates a new Task instance.
   * 
   * @constructor
   * @param {string} id - Unique identifier for the task.
   * @param {string} title - Title of the task.
   * @param {string} description - Detailed description of the task.
   * @param {TaskStatus} status - Current status of the task.
   * @param {TaskPriority} priority - Priority level of the task.
   * @param {Date} dueDate - Due date for the task.
   * @param {string} createdByUserId - ID of the user who created the task.
   * @param {Category} category - Category of the task.
   * @param {Date} [createdAt=new Date()] - The date when the task was created.
   * @param {Date} [updatedAt=new Date()] - The date when the task was last updated.
   */
  constructor(
    private id: string,
    private title: string,
    private description: string,
    private status: TaskStatus,
    private priority: TaskPriority,
    private dueDate: Date,
    private createdByUserId: string,
    private category: Category,
    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {}

  // Getters
  getId(): string { return this.id; }
  getTitle(): string { return this.title; }
  getDescription(): string { return this.description; }
  getStatus(): TaskStatus { return this.status; }
  getPriority(): TaskPriority { return this.priority; }
  getDueDate(): Date { return this.dueDate; }
  getCreatedByUserId(): string { return this.createdByUserId; }
  getCategory(): Category { return this.category; }
  getCreatedAt(): Date { return this.createdAt; }
  getUpdatedAt(): Date { return this.updatedAt; }

  /**
   * Sets a new title for the task.
   * 
   * @param {string} title - The new title to set.
   */
  setTitle(title: string): void {
    this.title = title;
    this.updatedAt = new Date();
  }

  /**
   * Sets a new description for the task.
   * 
   * @param {string} description - The new description to set.
   */
  setDescription(description: string): void {
    this.description = description;
    this.updatedAt = new Date();
  }

  /**
   * Updates the status of the task.
   * 
   * @param {TaskStatus} status - The new status to set for the task.
   */
  setStatus(status: TaskStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  /**
   * Sets a new priority for the task.
   * 
   * @param {TaskPriority} priority - The new priority to set.
   */
  setPriority(priority: TaskPriority): void {
    this.priority = priority;
    this.updatedAt = new Date();
  }

  /**
   * Sets a new due date for the task.
   * 
   * @param {Date} dueDate - The new due date to set.
   */
  setDueDate(dueDate: Date): void {
    this.dueDate = dueDate;
    this.updatedAt = new Date();
  }

  /**
   * Sets a new category for the task.
   * 
   * @param {Category} category - The new category to set.
   */
  setCategory(category: Category): void {
    this.category = category;
    this.updatedAt = new Date();
  }

  /**
   * Checks if the task is overdue.
   * 
   * @returns {boolean} True if the task is overdue, false otherwise.
   */
  isOverdue(): boolean {
    return this.dueDate < new Date();
  }

  /**
   * Creates a string representation of the task.
   * 
   * @returns {string} A string describing the task.
   */
  toString(): string {
    return `Task ${this.id}: ${this.title} (${this.status}) - Category: ${this.category.getName()}`;
  }
}
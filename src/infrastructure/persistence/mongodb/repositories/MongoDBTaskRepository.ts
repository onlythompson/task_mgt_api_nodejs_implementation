/**
 * MongoDBTaskRepository.ts
 * 
 * This file implements the ITaskRepository interface using Mongoose for MongoDB access.
 * It provides methods to perform CRUD operations on Task entities in the database.
 * 
 * @module MongoDBTaskRepository
 */

import { injectable } from 'tsyringe';
import { Task, TaskStatus, TaskPriority, TaskRepository, Category } from '../../../../domain/task';
import { TaskModel, ITaskDocument } from '../models/TaskModel';
import mongoose from 'mongoose';

/**
 * Repository implementation for Task entities using MongoDB and Mongoose.
 * 
 * @class MongoDBTaskRepository
 * @implements {TaskRepository}
 */
@injectable()
export class MongoDBTaskRepository implements TaskRepository {
  /**
   * Finds a task by its unique identifier.
   * 
   * @async
   * @param {string} id - The unique identifier of the task.
   * @returns {Promise<Task | null>} A promise that resolves to the Task if found, or null if not found.
   * @throws {Error} If there's an issue with the database operation.
   */
  async findById(id: string): Promise<Task | null> {
    const taskDoc = await TaskModel.findById(id);
    return taskDoc ? this.mapToTask(taskDoc) : null;
  }

  /**
   * Finds all tasks created by a specific user.
   * 
   * @async
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<Task[]>} A promise that resolves to an array of Tasks.
   * @throws {Error} If there's an issue with the database operation.
   */
  async findByUser(userId: string): Promise<Task[]> {
    const taskDocs = await TaskModel.find({ createdByUserId: userId });
    return taskDocs.map(this.mapToTask);
  }

  /**
   * Finds all tasks in a specific category for a specific user.
   * 
   * @async
   * @param {string} userId - The unique identifier of the user.
   * @param {Category} category - The category to filter by.
   * @returns {Promise<Task[]>} A promise that resolves to an array of Tasks.
   * @throws {Error} If there's an issue with the database operation.
   */
  async findByCategoryAndUser(userId: string, category: Category): Promise<Task[]> {
    const taskDocs = await TaskModel.find({
      createdByUserId: userId,
      'category.name': category.getName()
    });
    return taskDocs.map(this.mapToTask);
  }


  /**
   * Finds all tasks in a specific category.
   * 
   * @async
   * @param {Category} category - The category to filter by.
   * @returns {Promise<Task[]>} A promise that resolves to an array of Tasks.
   * @throws {Error} If there's an issue with the database operation.
   */
  async findByCategory(category: Category): Promise<Task[]> {
    const taskDocs = await TaskModel.find({ 'category.name': category.getName() });
    return taskDocs.map(this.mapToTask);
  }

  /**
   * Saves a new task or updates an existing one.
   * 
   * @async
   * @param {Task} task - The task to save or update.
   * @returns {Promise<Task>} A promise that resolves to the saved Task.
   * @throws {Error} If there's an issue with the database operation or if the task is not found when updating.
   */
  async save(task: Task): Promise<Task> {
    const taskData = this.mapToDocument(task);
    let taskDoc: ITaskDocument | null = null;

    if (task.getId() !== '' && task.getId() !== null) {
      try {
        taskDoc = await TaskModel.findByIdAndUpdate(
          new mongoose.Types.ObjectId(task.getId()),
          { $set: taskData },
          { new: true, runValidators: true }
        );
        if (!taskDoc) {
          throw new Error('Task not found');
        }
      } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
          throw new Error('Invalid task ID');
        }
        throw error;
      }
    } else {
      taskDoc = new TaskModel(taskData);
      await taskDoc.save();
    }

    return this.mapToTask(taskDoc);
  }

  /**
   * Deletes a task by its unique identifier.
   * 
   * @async
   * @param {string} id - The unique identifier of the task to delete.
   * @returns {Promise<void>} A promise that resolves when the task is deleted.
   * @throws {Error} If there's an issue with the database operation.
   */
  async delete(id: string): Promise<void> {
    const result = await TaskModel.findByIdAndDelete(new mongoose.Types.ObjectId(id));
    if (!result) {
      throw new Error('Task not found');
    }
  }

  /**
   * Finds all tasks.
   * 
   * @async
   * @returns {Promise<Task[]>} A promise that resolves to an array of all Tasks.
   * @throws {Error} If there's an issue with the database operation.
   */
  async findAll(): Promise<Task[]> {
    const taskDocs = await TaskModel.find();
    return taskDocs.map(this.mapToTask);
  }

  /**
   * Maps a Mongoose task document to a Task domain entity.
   * 
   * @private
   * @param {ITaskDocument} taskDoc - The Mongoose task document to map.
   * @returns {Task} The mapped Task domain entity.
   */
  private mapToTask(taskDoc: ITaskDocument): Task {
    return new Task(
      (taskDoc._id as string).toString(),
      taskDoc.title,
      taskDoc.description,
      taskDoc.status as TaskStatus,
      taskDoc.priority as TaskPriority,
      taskDoc.dueDate,
      taskDoc.createdByUserId,
      new Category(taskDoc.category.name, taskDoc.category.description),
      taskDoc.createdAt,
      taskDoc.updatedAt
    );
  }

  /**
   * Maps a Task domain entity to a plain object for Mongoose operations.
   * 
   * @private
   * @param {Task} task - The Task domain entity to map.
   * @returns {Partial<ITaskDocument>} A plain object representation of the task for database operations.
   */
  private mapToDocument(task: Task): Partial<ITaskDocument> {
    return {
      title: task.getTitle(),
      description: task.getDescription(),
      status: task.getStatus(),
      priority: task.getPriority(),
      dueDate: task.getDueDate(),
      createdByUserId: task.getCreatedByUserId(),
      category: {
        name: task.getCategory().getName(),
        description: task.getCategory().getDescription()
      },
      updatedAt: new Date()
    };
  }
}
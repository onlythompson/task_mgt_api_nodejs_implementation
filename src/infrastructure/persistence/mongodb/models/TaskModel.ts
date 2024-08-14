/**
 * 
 * This file defines the Mongoose model for the Task entity.
 * 
 * @module TaskModel
 */

import mongoose, { Schema, Document } from 'mongoose';
import { TaskStatus, TaskPriority, Task } from '../../../../domain/task';

/**
 * Interface representing a Task document in MongoDB.
 */
export interface ITaskDocument extends Document {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  createdByUserId: string;
  category: {
    name: string;
    description?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for the Task entity.
 */
export const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: Object.values(TaskStatus), default: TaskStatus.TODO },
  priority: { type: String, enum: Object.values(TaskPriority), default: TaskPriority.MEDIUM },
  dueDate: { type: Date, required: true },
  createdByUserId: { type: String, required: true },
  category: {
    name: { type: String, required: true },
    description: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

/**
 * Mongoose model for the Task entity.
 */
export const TaskModel = mongoose.model<ITaskDocument>('Task', TaskSchema);
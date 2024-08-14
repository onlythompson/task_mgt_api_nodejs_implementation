/**
 * 
 * This file defines the Mongoose model for the User entity.
 * 
 * @module UserModel
 */

import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface representing a User document in MongoDB.
 */
export interface IUserDocument extends Document {
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for the User entity.
 */
const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

/**
 * Mongoose model for the User entity.
 */
export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
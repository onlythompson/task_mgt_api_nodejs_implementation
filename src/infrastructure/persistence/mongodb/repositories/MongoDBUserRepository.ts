/**
 * MongoDBUserRepository.ts
 * 
 * This file implements the IUserRepository interface using Mongoose for MongoDB access.
 * It provides methods to perform CRUD operations on User entities in the database.
 * 
 * @module MongoDBUserRepository
 */

import { injectable } from 'tsyringe';
import { User, UserRepository } from '../../../../domain/user';
import { UserModel, IUserDocument } from '../models/UserModel';

/**
 * Repository implementation for User entities using MongoDB and Mongoose.
 * 
 * @class MongoDBUserRepository
 * @implements {IUserRepository}
 */
@injectable()
export class MongoDBUserRepository implements UserRepository {
  /**
   * Finds a user by their unique identifier.
   * 
   * @async
   * @param {string} id - The unique identifier of the user.
   * @returns {Promise<User | null>} A promise that resolves to the User if found, or null if not found.
   * @throws {Error} If there's an issue with the database operation.
   */
  async findById(id: string): Promise<User | null> {
    const userDoc = await UserModel.findById(id);
    return userDoc ? this.mapToUser(userDoc) : null;
  }

  /**
   * Finds a user by their email address.
   * 
   * @async
   * @param {string} email - The email address of the user.
   * @returns {Promise<User | null>} A promise that resolves to the User if found, or null if not found.
   * @throws {Error} If there's an issue with the database operation.
   */
  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email });
    return userDoc ? this.mapToUser(userDoc) : null;
  }

  /**
   * Saves a new user or updates an existing one.
   * 
   * @async
   * @param {User} user - The user to save or update.
   * @returns {Promise<User>} A promise that resolves to the saved User.
   * @throws {Error} If there's an issue with the database operation or if the user is not found when updating.
   */
  async save(user: User): Promise<User> {
    let userDoc: IUserDocument | null = null;
    if (user.getId()) {
      userDoc = await UserModel.findByIdAndUpdate(
        user.getId(),
        this.mapToDocument(user),
        { new: true, runValidators: true }
      );
      if (!userDoc) throw new Error('User not found');
    } else {
      userDoc = new UserModel(this.mapToDocument(user));
      await userDoc.save();
    }
    return this.mapToUser(userDoc);
  }

  /**
   * Deletes a user by their unique identifier.
   * 
   * @async
   * @param {string} id - The unique identifier of the user to delete.
   * @returns {Promise<void>} A promise that resolves when the user is deleted.
   * @throws {Error} If there's an issue with the database operation.
   */
  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  /**
   * Finds all users.
   * 
   * @async
   * @returns {Promise<User[]>} A promise that resolves to an array of all Users.
   * @throws {Error} If there's an issue with the database operation.
   */
  async findAll(): Promise<User[]> {
    const userDocs = await UserModel.find();
    return userDocs.map(this.mapToUser);
  }

  /**
   * Maps a Mongoose user document to a User domain entity.
   * 
   * @private
   * @param {IUserDocument} userDoc - The Mongoose user document to map.
   * @returns {User} The mapped User domain entity.
   */
  private mapToUser(userDoc: IUserDocument): User {
    return new User(
      (userDoc._id as string).toString(),
      userDoc.username,
      userDoc.email,
      userDoc.passwordHash,
      userDoc.createdAt,
      userDoc.updatedAt
    );
  }

  /**
   * Maps a User domain entity to a plain object for Mongoose operations.
   * 
   * @private
   * @param {User} user - The User domain entity to map.
   * @returns {Partial<IUserDocument>} A plain object representation of the user for database operations.
   */
  private mapToDocument(user: User): Partial<IUserDocument> {
    return {
      username: user.getUsername(),
      email: user.getEmail(),
      passwordHash: user.getPasswordHash(),
      updatedAt: new Date()
    };
  }
}
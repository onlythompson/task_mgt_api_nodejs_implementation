/**
 * UserRepository.ts
 * 
 * This file defines the UserRepository interface for the task management system.
 * It provides methods for persisting and retrieving User entities.
 * 
 * @module UserRepository
 */

import { User } from './User';

/**
 * Represents the interface for User data access operations.
 * 
 * @interface UserRepository
 */
export interface UserRepository {
  /**
   * Finds a user by their unique identifier.
   * 
   * @param {string} id - The unique identifier of the user.
   * @returns {Promise<User | null>} A promise that resolves to the found User or null if not found.
   */
  findById(id: string): Promise<User | null>;

  /**
   * Finds a user by their email address.
   * 
   * @param {string} email - The email address of the user.
   * @returns {Promise<User | null>} A promise that resolves to the found User or null if not found.
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Saves a new user or updates an existing one.
   * 
   * @param {User} user - The user to save or update.
   * @returns {Promise<User>} A promise that resolves to the saved User.
   */
  save(user: User): Promise<User>;

  /**
   * Deletes a user by their unique identifier.
   * 
   * @param {string} id - The unique identifier of the user to delete.
   * @returns {Promise<void>} A promise that resolves when the user is deleted.
   */
  delete(id: string): Promise<void>;

  /**
   * Finds all users.
   * 
   * @returns {Promise<User[]>} A promise that resolves to an array of all Users.
   */
  findAll(): Promise<User[]>;
}
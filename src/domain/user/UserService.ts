/**
 * 
 * This file defines the UserService class for the task management system.
 * It encapsulates the business logic for user-related operations.
 * 
 * @module UserService
 */

import { inject, injectable } from 'tsyringe';
import { User } from './User';
import { UserRepository } from './UserRepository';
import UserUpdateParams from './UserUpdateParams';

/**
 * Service class for managing users in the system.
 * 
 * @class UserService
 */
@injectable()
export class UserService {
  constructor(@inject("UserRepository")private userRepository: UserRepository) {}

  /**
   * Creates a new user.
   * 
   * @param {string} username - The username of the new user.
   * @param {string} email - The email of the new user.
   * @param {string} password - The password of the new user.
   * @returns {Promise<User>} A promise that resolves to the created User.
   * @throws {Error} If a user with the given email already exists.
   */
  async createUser(username: string, email: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser = new User(
      Date.now().toString(), // Simple ID generation, consider using UUID in production
      username,
      email,
      password// In a real app, use a proper password hashing function
    );
    return this.userRepository.save(newUser);
  }

  /**
   * Updates an existing user.
   * 
   * @param {string} id - The ID of the user to update.
   * @param {UserUpdateParams} updates - The properties of the user to update.
   * @returns {Promise<User>} A promise that resolves to the updated User.
   * @throws {Error} If the user is not found.
   */
  async updateUser(id: string, updates: UserUpdateParams): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, updates);
    return this.userRepository.save(user);
  }

  /**
   * Deletes a user.
   * 
   * @param {string} id - The ID of the user to delete.
   * @returns {Promise<void>} A promise that resolves when the user is deleted.
   */
  async deleteUser(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }

  /**
   * Retrieves a user by their ID.
   * 
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<User | null>} A promise that resolves to the User or null if not found.
   */
  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  /**
   * Retrieves a user by their email address.
   * 
   * @param {string} email - The email of the user to retrieve.
   * @returns {Promise<User | null>} A promise that resolves to the User or null if not found.
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

}
/**
 * User.ts
 * 
 * This file defines the User entity for the task management system.
 * Users represent individuals who can create and manage tasks in the system.
 * 
 * @module User
 */

/**
 * Represents a user in the task management system.
 * 
 * Users are individuals who interact with the task management system. They can
 * create tasks, update their status, and manage their own profile information.
 * 
 * @class User
 */
export class User {
    /**
     * Creates a new User instance.
     * 
     * @constructor
     * @param {string} id - Unique identifier for the user.
     * @param {string} username - Username of the user.
     * @param {string} email - Email address of the user.
     * @param {string} passwordHash - Hashed password of the user.
     * @param {Date} [createdAt=new Date()] - The date when the user account was created.
     * @param {Date} [updatedAt=new Date()] - The date when the user account was last updated.
     */
    constructor(
      private id: string,
      private username: string,
      private email: string,
      private passwordHash: string,
      private createdAt: Date = new Date(),
      private updatedAt: Date = new Date()
    ) {}
  
    // Getters
    getId(): string { return this.id; }
    getUsername(): string { return this.username; }
    getEmail(): string { return this.email; }
    getCreatedAt(): Date { return this.createdAt; }
    getUpdatedAt(): Date { return this.updatedAt; }
    getPasswordHash(): string { return this.passwordHash; }
  
    /**
     * Sets a new username for the user.
     * 
     * @param {string} username - The new username to set.
     */
    setUsername(username: string): void {
      this.username = username;
      this.updatedAt = new Date();
    }
  
    /**
     * Sets a new email address for the user.
     * 
     * @param {string} email - The new email address to set.
     */
    setEmail(email: string): void {
      this.email = email;
      this.updatedAt = new Date();
    }
  
    /**
     * Updates the user's password.
     * 
     * @param {string} newPasswordHash - The new password hash to set for the user.
     */
    updatePassword(newPasswordHash: string): void {
      this.passwordHash = newPasswordHash;
      this.updatedAt = new Date();
    }
  
    /**
     * Checks if the provided password matches the user's password.
     * 
     * @param {string} passwordHash - The password hash to check.
     * @returns {boolean} True if the password matches, false otherwise.
     */
    checkPassword(passwordHash: string): boolean {
      return this.passwordHash === passwordHash;
    }
  
    /**
     * Creates a string representation of the user.
     * 
     * @returns {string} A string describing the user.
     */
    toString(): string {
      return `User ${this.id}: ${this.username} (${this.email})`;
    }
  }
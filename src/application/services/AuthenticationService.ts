import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User, UserService } from '../../domain/user';
import { inject, injectable } from 'tsyringe';
import { APP_CONFIG } from '../../config/app';

/**
 * Service class for handling authentication-related operations.
 * 
 * @class AuthenticationService
 */
@injectable()
export class AuthenticationService {

  /**
   * Creates an instance of AuthenticationService.
   * 
   * @constructor
   * @param {UserService} userService - The user service for user-related operations.
   * @param {AuthConfig} config - Configuration for authentication operations.
   */
  constructor(@inject(UserService) private userService: UserService) { }

  /**
   * Authenticates a user and generates a JWT token.
   * 
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<string>} A promise that resolves to the JWT token.
   * @throws {Error} If authentication fails.
   */
  async login(email: string, password: string): Promise<string> {
    try {
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await this.verifyPassword(password, user.getPasswordHash());
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      return this.generateToken(user);
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }

  /**
   * Registers a new user.
   * 
   * @param {string} username - The username of the new user.
   * @param {string} email - The email of the new user.
   * @param {string} password - The password of the new user.
   * @returns {Promise<User>} A promise that resolves to the created User.
   * @throws {Error} If registration fails.
   */
  async register(username: string, email: string, password: string): Promise<User> {
    console.log("Processing user registration")
    const hashedPassword = await this.hashPassword(password);
    console.log(hashedPassword)
    return await this.userService.createUser(username, email, hashedPassword);
  }

  /**
   * Verifies a JWT token.
   * 
   * @param {string} token - The JWT token to verify.
   * @returns {Promise<User>} A promise that resolves to the User if the token is valid.
   * @throws {Error} If the token is invalid or expired.
   */
  async verifyToken(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(token, APP_CONFIG.jwtSecret) as { id: string };
      const user = await this.userService.getUserById(decoded.id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Generates a new JWT token for a user.
   * 
   * @param {User} user - The user to generate a token for.
   * @returns {string} The generated JWT token.
   */
  private generateToken(user: User): string {
    const payload = {
      id: user.getId(),
      email: user.getEmail(),
      username: user.getUsername()
    };
    return jwt.sign(payload, APP_CONFIG.jwtSecret, { expiresIn: APP_CONFIG.jwtExpiresIn });
  }

  /**
   * Hashes a password using bcrypt.
   * 
   * @param {string} password - The password to hash.
   * @returns {Promise<string>} A promise that resolves to the hashed password.
   */
  private async hashPassword(password: string): Promise<string> {
    try {
      const saltRounds = Number(APP_CONFIG.bcryptSaltRounds);
      if (isNaN(saltRounds)) {
        throw new Error('Invalid salt rounds configuration');
      }
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Failed to hash password');
    }
  }
  /**
   * Verifies a password against a hash.
   * 
   * @param {string} password - The password to verify.
   * @param {string} hash - The hash to verify against.
   * @returns {Promise<boolean>} A promise that resolves to true if the password is valid, false otherwise.
   */
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error('Error verifying password:', error);
      throw new Error('Failed to verify password');
    }
  }

  /**
   * Refreshes a JWT token.
   * 
   * @param {string} token - The current JWT token.
   * @returns {Promise<string>} A promise that resolves to a new JWT token.
   * @throws {Error} If the token refresh fails.
   */
  async refreshToken(token: string): Promise<string> {
    try {
      const user = await this.verifyToken(token);
      return this.generateToken(user);
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  }

  /**
   * Changes a user's password.
   * 
   * @param {string} userId - The ID of the user.
   * @param {string} currentPassword - The current password of the user.
   * @param {string} newPassword - The new password to set.
   * @returns {Promise<void>} A promise that resolves when the password is changed.
   * @throws {Error} If the password change fails.
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isCurrentPasswordValid = await this.verifyPassword(currentPassword, user.getPasswordHash());
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const newPasswordHash = await this.hashPassword(newPassword);
    await this.userService.updateUser(userId, { passwordHash: newPasswordHash });
  }

  /**
   * Logs out a user by invalidating their token.
   * Note: This method is a placeholder and should be implemented based on your token invalidation strategy.
   * 
   * @param {string} token - The JWT token to invalidate.
   * @returns {Promise<void>} A promise that resolves when the logout is complete.
   */
  async logout(token: string): Promise<void> {
    // Implement token invalidation strategy here.
    // This could involve adding the token to a blacklist, or updating the user's record in the database.
    console.log('User logged out, token invalidated:', token);
  }
}
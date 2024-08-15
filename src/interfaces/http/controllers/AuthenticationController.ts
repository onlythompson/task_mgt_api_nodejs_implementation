import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { AuthenticationService } from '../../../application/services/AuthenticationService';
import { UserService } from '../../../domain/user/UserService';
import { User } from '../../../domain/user';

@injectable()
export class AuthenticationController {
  constructor(
    @inject(AuthenticationService) private authService: AuthenticationService,
    @inject(UserService) private userService: UserService
  ) { }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;
      const user = await this.authService.register(username, email, password);
      res.status(201).json({ message: 'User registered successfully', userId: user.getId() });
    } catch (error) {
      res.status(400).json({ message: 'Registration failed', error: error });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const token = await this.authService.login(email, password);
      res.json({ token });
    } catch (error) {
      res.status(401).json({ message: 'Authentication failed', error: error });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new Error('No token provided');
      }
      await this.authService.logout(token);
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Logout failed', error: error });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new Error('No token provided');
      }
      const newToken = await this.authService.refreshToken(token);
      res.json({ token: newToken });
    } catch (error) {
      res.status(401).json({ message: 'Token refresh failed', error: error });
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      // const userId = req.user?.getId(); // Assuming the user ID is attached to the request by a middleware
      const userId = (req as Request & { user?: User }).user?.getId();
      if (!userId) {
        res.status(400).json({ message: 'User ID is missing' });
        return;
      }
      const { currentPassword, newPassword } = req.body;
      await this.authService.changePassword(userId, currentPassword, newPassword);
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Password change failed', error: error });
    }
  }

  async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      // const userId = req.user?.getId(); // Assuming the user ID is attached to the request by a middleware
      const userId = (req as Request & { user?: User }).user?.getId();
      if (!userId) {
        res.status(400).json({ message: 'User ID is missing' });
        return;
      }

      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      res.json({
        id: user.getId(),
        username: user.getUsername(),
        email: user.getEmail(),
        createdAt: user.getCreatedAt(),
        updatedAt: user.getUpdatedAt()
      });
    } catch (error) {
      res.status(400).json({ message: 'Failed to retrieve user profile', error: error });
    }
  }
}
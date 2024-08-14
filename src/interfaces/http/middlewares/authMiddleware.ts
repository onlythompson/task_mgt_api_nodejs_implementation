import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import jwt from 'jsonwebtoken';
import { AuthenticationService } from '../../../application/services/AuthenticationService';
import { UserService } from '../../../domain/user/UserService';
import { APP_CONFIG } from '../../../config/app';
import logger from '../../../utility/shared/logger';
import { User } from '../../../domain/user/User';

// Extend the Express Request type to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: User; // Replace 'any' with your User type
    }
  }
}

@injectable()
export class AuthMiddleware {
  constructor(
    @inject(AuthenticationService) private authService: AuthenticationService,
    @inject(UserService) private userService: UserService
  ) {}

  public authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = this.extractTokenFromHeader(req);

      if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
      }

      const decoded = await this.authService.verifyToken(token);

      if (!decoded || typeof decoded === 'string') {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }

      const user = await this.userService.getUserById(decoded.getId());

      if (!user) {
        res.status(401).json({ error: 'User not found' });
        return;
      }

      // Attach the user to the request object for use in subsequent middleware or route handlers
      req.user = user;

      next();
    } catch (error) {
      logger.error('Authentication error:', error);
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ error: 'Token expired' });
      } else if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ error: 'Invalid token' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  private extractTokenFromHeader(req: Request): string | null {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }
}

// Export a factory function to create the middleware
export const createAuthMiddleware = (container: any) => {
  const authMiddleware = container.resolve(AuthMiddleware);
  return authMiddleware.authenticate;
};
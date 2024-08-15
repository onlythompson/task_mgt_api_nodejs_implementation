// Extend the Express Request type to include a user property
import { User } from '../domain/user/User';  // Adjust this import path as necessary

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
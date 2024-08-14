import { Request, Response, NextFunction } from 'express';
import { APP_CONFIG } from '../../../config/app';
import logger  from '../../../utility/shared/logger';

/**
 * Middleware to log HTTP requests.
 */
export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logMessage = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;

    if (APP_CONFIG.environment === 'production') {
      if (res.statusCode >= 400) {
        logger.error(logMessage);
      } else {
        logger.info(logMessage);
      }
    } else {
      logger.info(logMessage);
    }
  });

  next();
};
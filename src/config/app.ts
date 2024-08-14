/**
 * Application Configuration
 * 
 * This module provides centralized configuration for the Task Management application.
 * It uses environment variables for flexible configuration across different
 * environments (development, staging, production).
 * 
 * @module config/app
 */

import dotenv from 'dotenv';

dotenv.config();

/**
 * Application configuration object
 * @typedef {Object} AppConfig
 * @property {number} port - The port on which the server will listen
 * @property {string} environment - The current environment (development, staging, production)
 * @property {string} apiVersion - The version of the API
 * @property {Object} cors - CORS configuration
 * @property {string} cors.origin - Allowed origins for CORS
 * @property {string[]} cors.methods - Allowed HTTP methods for CORS
 * @property {Object} rateLimit - Rate limiting configuration
 * @property {number} rateLimit.windowMs - Time window for rate limiting in milliseconds
 * @property {number} rateLimit.max - Maximum number of requests per IP within the time window
 * @property {Object} logging - Logging configuration
 * @property {string} logging.level - The logging level (e.g., 'info', 'error', 'debug')
 */

/**
 * The application configuration
 * @type {AppConfig}
 */
export const APP_CONFIG = {
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
  apiVersion: process.env.API_VERSION || 'v1',
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  logFormat: ':date[iso] :method :url :status :response-time ms - :res[content-length] :remote-addr :message',
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  jwtSecret: process.env.JWT || 'your-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS || 10,
};
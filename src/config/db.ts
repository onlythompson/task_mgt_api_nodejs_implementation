/**
 * Database Configuration
 * 
 * This module provides centralized configuration for the database connection
 * in the Task Management application. It uses environment variables to allow for
 * flexible configuration across different environments.
 * 
 * @module config/database
 */

import dotenv from 'dotenv';

dotenv.config();

/**
 * Database configuration object
 * @typedef {Object} DbConfig
 * @property {string} uri - The MongoDB connection URI
 * @property {Object} options - MongoDB connection options
 * @property {boolean} options.useNewUrlParser - Use new URL parser
 * @property {boolean} options.useUnifiedTopology - Use new Server Discover and Monitoring engine
 * @property {boolean} options.useCreateIndex - Use createIndex() instead of ensureIndex()
 * @property {boolean} options.useFindAndModify - Set to false to make findOneAndUpdate() and findOneAndRemove() use native findOneAndUpdate() rather than findAndModify()
 */

/**
 * The database configuration
 * @type {DbConfig}
 */
export const DB_CONFIG = {
  mongodb_uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/task_mgt_db',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  // Add any additional database-specific configurations here
};
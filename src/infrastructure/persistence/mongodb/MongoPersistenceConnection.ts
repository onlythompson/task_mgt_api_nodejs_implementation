
import mongoose from 'mongoose';
import { DB_CONFIG } from '../../../config/db';
import logger from '../../../utility/shared/logger';
import { APP_CONFIG } from '../../../config/app';

//@injectable()
export class MongoPersistenceConnection {
  private static instance: MongoPersistenceConnection;
  private retryAttempts = 0;
  private maxRetryAttempts = 5; // Adjust as needed
  private baseRetryInterval = 5000; // 5 seconds, adjust as needed

  private constructor() { }

  public static getInstance(): MongoPersistenceConnection {
    if (!MongoPersistenceConnection.instance) {
      MongoPersistenceConnection.instance = new MongoPersistenceConnection();
    }
    return MongoPersistenceConnection.instance;
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(DB_CONFIG.mongodb_uri);

      mongoose.connection.on('connected', () => {
        logger.info('Connected to MongoDB');
        this.retryAttempts = 0;// Reset retry attempts
      });

      mongoose.connection.on('error', (err) => {
        logger.error(`MongoDB connection error: ${err}`);
        this.handleConnectionError();
      });

      mongoose.connection.on('disconnected', () => {
        logger.info('Disconnected from MongoDB');
      });

      // If the Node process ends, close the MongoDB connection
      process.on('SIGINT', this.closeConnection);
      process.on('SIGTERM', this.closeConnection);

    } catch (error) {
      logger.error(`Error connecting to MongoDB: ${error}`);
      if (APP_CONFIG.environment === 'development') {
        process.exit(1);
      }
      this.handleConnectionError();
    }
  }
  private handleConnectionError() {
    if (this.retryAttempts < this.maxRetryAttempts) {
      const retryInterval = this.baseRetryInterval * Math.pow(2, this.retryAttempts);
      this.retryAttempts++;
      logger.warn(`Retrying MongoDB connection in ${retryInterval / 1000} seconds... (Attempt ${this.retryAttempts})`);
      setTimeout(() => this.connect(), retryInterval);
    } else {
      logger.error('Max retry attempts reached. Exiting...');
      // In production, you might want to alert or log this critically instead of exiting
      if (APP_CONFIG.environment === 'development') {
        process.exit(1);
      }
    }
  }

  public async closeConnection(): Promise<void> {
    try {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    } catch (error) {
      logger.error(`Error closing MongoDB connection: ${error}`);
      process.exit(1);
    }
  }
  public async seedDatabase(): Promise<void> {
    try {
      // Check if the database is empty
      // const collections = await mongoose.connection.db.listCollections().toArray();
      // logger.info(mongoose.connection.db);
      if (APP_CONFIG.environment !== 'production') {
        // Define the collections we expect in our application
        const expectedCollections = ['categories', 'subcategories', 'activities', 'users', 'profiles'];

        // Check if these collections exist and have any documents
        const collectionChecks = await Promise.all(expectedCollections.map(async (collectionName) => {
          const collection = mongoose.connection.db.collection(collectionName);
          const count = await collection.countDocuments();
          return count > 0;
        }));


        // if (collectionChecks.every(check => !check)) {

        //   logger.info('Database is empty. Starting seeding process...');

        //   logger.warn('Seeding is only allowed in development environment. Exiting...');


        //   // Import your seed data here
        //   const { seedCategoriesSubcategories } = require('../../../scripts/seedCategoriesSubcategories');
        //   // const { seedActivities } = require('../../../scripts/seedActivities');
        //   // const { seedUsers } = require('../../../scripts/seedUsers');
        //   // const { seedProfiles } = require('../../../scripts/seedProfiles');

        //   // Run your seed functions
        //   await seedCategoriesSubcategories();
        //   // await seedActivities();
        //   // await seedUsers();
        //   // await seedProfiles();

        //   logger.info('Database seeding completed successfully.');

        // } else {
        //   logger.info('Database is not empty. Skipping seeding process.');
        // }
      }
    } catch (error) {
      logger.error(`Error seeding database: ${error}`);
      if (APP_CONFIG.environment === 'development') {
        throw error;
      }
    }
  }
}

// Export a singleton instance
export const mongoPersistenceConnection = MongoPersistenceConnection.getInstance();
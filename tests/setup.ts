import 'reflect-metadata';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Declare global types
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(a: number, b: number): R;
    }
  }

  var testUser: {
    email: string;
    provider: string;
    providerId: string;
  };

  function createTestUser(overrides?: Partial<typeof testUser>): Promise<any>;

  namespace NodeJS {
    interface Global {
      testUser: typeof testUser;
      createTestUser: typeof createTestUser;
    }
  }
}

// Custom matcher example
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Global test timeout (optional, adjust as needed)
jest.setTimeout(30000); // 30 seconds

// MongoDB Memory Server setup
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Global mocks (example)
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

// Clean up mocks
afterEach(() => {
  jest.clearAllMocks();
});

// Example of setting up global test data
global.testUser = {
  email: 'test@example.com',
  provider: 'google',
  providerId: 'google123',
};

// Console error and warning suppression (optional)
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Example of a utility function available to all tests
global.createTestUser = async (overrides = {}) => {
  const UserModel = mongoose.model('User');
  const userData = { ...global.testUser, ...overrides };
  return await UserModel.create(userData);
};
/**
 * container.ts
 * 
 * This file sets up the dependency injection container for the task management system.
 * It registers all the dependencies that will be used throughout the application.
 * 
 * @module container
 */

import { container } from "tsyringe";
import { TaskRepository, TaskService, TaskFactory } from "./domain/task";
import { UserRepository, UserService } from "./domain/user";
import { MongoDBTaskRepository, MongoDBUserRepository } from "./infrastructure/persistence/mongodb/repositories";
import { AuthenticationService } from "./application/services/AuthenticationService";
import { AuthMiddleware } from "./interfaces/http/middlewares/authMiddleware";

/**
 * Configures the dependency injection container.
 * This function should be called at the application's entry point.
 */

// Repositories
container.register<TaskRepository>("TaskRepository", {
  useClass: MongoDBTaskRepository
});
container.register<UserRepository>("UserRepository", {
  useClass: MongoDBUserRepository
});

// Services
container.registerSingleton<TaskService>(TaskService);
container.registerSingleton<UserService>(UserService);

// Factories
container.registerSingleton<TaskFactory>(TaskFactory);

container.registerSingleton<AuthenticationService>(AuthenticationService)

container.register<AuthMiddleware>(AuthMiddleware, { useClass: AuthMiddleware });

export { container };
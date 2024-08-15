/**
 * container.ts
 * 
 * This file sets up the dependency injection container for the task management system.
 * It registers all the dependencies that will be used throughout the application.
 * 
 * @module container
 */

import { container } from "tsyringe";
import { UserRepository, UserService } from "./domain/user";
import { TaskRepository, TaskService, TaskFactory } from "./domain/task";
import { MongoDBTaskRepository, MongoDBUserRepository } from "./infrastructure/persistence/mongodb/repositories";
import { AuthenticationService } from "./application/services/AuthenticationService";
import { AuthMiddleware } from "./interfaces/http/middlewares/authMiddleware";
import { CreateTaskUseCase, DeleteTaskUseCase, GetTaskByIdUseCase, GetTasksByCategoryUseCase, GetTasksByUserAndCategoryUseCase, GetTasksByUserUseCase, MarkTaskAsCompletedUseCase, UpdateTaskUseCase } from "./application/use-cases";
import { TaskController } from "./interfaces/http/controllers/TaskController";
import { AuthenticationController } from "./interfaces/http/controllers/AuthenticationController";

/**
 * Configures the dependency injection container.
 * This function should be called at the application's entry point.
 */

// Repositories
container.registerSingleton<TaskRepository>("TaskRepository", MongoDBTaskRepository);
container.register<UserRepository>("UserRepository", MongoDBUserRepository);
// Factories
container.registerSingleton<TaskFactory>(TaskFactory);

// Services
container.registerSingleton<UserService>(UserService);
container.registerSingleton<TaskService>(TaskService);

container.registerSingleton<AuthenticationService>(AuthenticationService)

//Middlewares
container.register<AuthMiddleware>(AuthMiddleware, { useClass: AuthMiddleware });


container.registerSingleton<CreateTaskUseCase>(CreateTaskUseCase)
container.registerSingleton<UpdateTaskUseCase>(UpdateTaskUseCase)
container.registerSingleton<GetTaskByIdUseCase>(GetTaskByIdUseCase)
container.registerSingleton<GetTasksByUserUseCase>(GetTasksByUserUseCase)
container.registerSingleton<GetTasksByCategoryUseCase>(GetTasksByCategoryUseCase)
container.registerSingleton<GetTasksByUserAndCategoryUseCase>(GetTasksByUserAndCategoryUseCase)
container.registerSingleton<DeleteTaskUseCase>(DeleteTaskUseCase)
container.registerSingleton<MarkTaskAsCompletedUseCase>(MarkTaskAsCompletedUseCase)

container.registerSingleton<AuthenticationController>(AuthenticationController)
container.registerSingleton<TaskController>(TaskController)


export { container };
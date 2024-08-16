import { container } from "tsyringe";
import { UserRepository, UserService } from "./domain/user";
import { TaskRepository, TaskService, TaskFactory } from "./domain/task";
import { MongoDBTaskRepository, MongoDBUserRepository } from "./infrastructure/persistence/mongodb/repositories";
import { AuthenticationService } from "./application/services/AuthenticationService";
import { AuthMiddleware } from "./interfaces/http/middlewares/authMiddleware";
import { CreateTaskUseCase, DeleteTaskUseCase, GetTaskByIdUseCase, GetTasksByCategoryUseCase, GetTasksByUserAndCategoryUseCase, GetTasksByUserUseCase, MarkTaskAsCompletedUseCase, UpdateTaskUseCase } from "./application/use-cases";
import { TaskController } from "./interfaces/http/controllers/TaskController";
import { AuthenticationController } from "./interfaces/http/controllers/AuthenticationController";

// Repositories
container.registerSingleton<TaskRepository>("TaskRepository", MongoDBTaskRepository);
container.registerSingleton<UserRepository>("UserRepository", MongoDBUserRepository);

// Factories
container.registerSingleton<TaskFactory>(TaskFactory);

// Services
container.registerSingleton<UserService>(UserService);
container.registerSingleton<TaskService>(TaskService);
container.registerSingleton<AuthenticationService>(AuthenticationService);

// Middlewares
container.registerSingleton<AuthMiddleware>(AuthMiddleware);

// Use Cases
container.registerSingleton<CreateTaskUseCase>(CreateTaskUseCase);
container.registerSingleton<UpdateTaskUseCase>(UpdateTaskUseCase);
container.registerSingleton<GetTaskByIdUseCase>(GetTaskByIdUseCase);
container.registerSingleton<GetTasksByUserUseCase>(GetTasksByUserUseCase);
container.registerSingleton<GetTasksByCategoryUseCase>(GetTasksByCategoryUseCase);
container.registerSingleton<GetTasksByUserAndCategoryUseCase>(GetTasksByUserAndCategoryUseCase);
container.registerSingleton<DeleteTaskUseCase>(DeleteTaskUseCase);
container.registerSingleton<MarkTaskAsCompletedUseCase>(MarkTaskAsCompletedUseCase);

// Controllers
container.registerSingleton<AuthenticationController>(AuthenticationController);
container.registerSingleton<TaskController>(TaskController);

export { container };
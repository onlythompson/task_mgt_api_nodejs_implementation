import { injectable, inject } from 'tsyringe';
import { TaskService, Task, TaskPriority, Category } from '../../domain/task';

/**
 * Use case for creating a new task.
 *
 * This class is responsible for handling the creation of a new task by interacting with the TaskService.
 * It is designed to be used with dependency injection.
 */
@injectable()
export default class CreateTaskUseCase{
  /**
   * Constructs a new CreateTaskUseCase.
   *
   * @param taskService - The service responsible for task-related operations.
   */
  constructor(@inject(TaskService) private taskService: TaskService) {}

  /**
   * Executes the use case to create a new task.
   *
   * @param title - The title of the task.
   * @param description - The description of the task.
   * @param dueDate - The due date of the task.
   * @param userId - The ID of the user creating the task.
   * @param category - The category of the task.
   * @param priority - (Optional) The priority of the task.
   * @returns A promise that resolves to the created Task object.
   *
   * @throws Will throw an error if the task creation fails.
   */
  async execute(
    title: string,
    description: string,
    dueDate: Date,
    userId: string,
    category: Category,
    priority?: TaskPriority
  ): Promise<Task> {
    return this.taskService.createTask(title, description, dueDate, userId, category, priority);
  }
}
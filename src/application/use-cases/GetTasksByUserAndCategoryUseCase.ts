import { injectable, inject } from 'tsyringe';
import { TaskService, Task, Category } from '../../domain/task';

/**
 * Use case for retrieving tasks by user ID and category.
 * 
 * This class is responsible for handling the retrieval of tasks based on the user ID and category by interacting with the TaskService.
 * It is designed to be used with dependency injection.
 */
@injectable()
export class GetTasksByUserAndCategoryUseCase {
  /**
   * Constructs a new GetTasksByUserAndCategoryUseCase.
   * 
   * @param taskService - The service responsible for task-related operations.
   */
  constructor(@inject(TaskService) private taskService: TaskService) {}

  /**
   * Executes the use case to retrieve tasks by user ID and category.
   * 
   * @param userId - The ID of the user whose tasks are to be retrieved.
   * @param category - The category of the tasks to be retrieved.
   * @returns A promise that resolves to an array of Task objects that belong to the specified user and category.
   * 
   * @throws Will throw an error if the task retrieval fails.
   */
  async execute(userId: string, category: Category): Promise<Task[]> {
    return this.taskService.getTasksByUserAndCategory(userId, category);
  }
}
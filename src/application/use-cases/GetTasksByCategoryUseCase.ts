import { injectable, inject } from 'tsyringe';
import { TaskService, Task, Category } from '../../domain/task';

/**
 * Use case for retrieving tasks by category.
 * 
 * This class is responsible for handling the retrieval of tasks based on their category by interacting with the TaskService.
 * It is designed to be used with dependency injection.
 */
@injectable()
export class GetTasksByCategoryUseCase {
  /**
   * Constructs a new GetTasksByCategoryUseCase.
   * 
   * @param taskService - The service responsible for task-related operations.
   */
  constructor(@inject(TaskService) private taskService: TaskService) {}

  /**
   * Executes the use case to retrieve tasks by category.
   * 
   * @param category - The category of the tasks to be retrieved.
   * @returns A promise that resolves to an array of Task objects that belong to the specified category.
   * 
   * @throws Will throw an error if the task retrieval fails.
   */
  async execute(category: Category): Promise<Task[]> {
    return this.taskService.getTasksByCategory(category);
  }
}
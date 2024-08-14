import { injectable, inject } from 'tsyringe';
import { TaskService, Task } from '../../domain/task';

/**
 * Use case for retrieving tasks by user ID.
 * 
 * This class is responsible for handling the retrieval of tasks based on the user ID by interacting with the TaskService.
 * It is designed to be used with dependency injection.
 */
@injectable()
export class GetTasksByUserUseCase{
  /**
   * Constructs a new GetTasksByUserUseCase.
   * 
   * @param taskService - The service responsible for task-related operations.
   */
  constructor(@inject(TaskService) private taskService: TaskService) {}

  /**
   * Executes the use case to retrieve tasks by user ID.
   * 
   * @param userId - The ID of the user whose tasks are to be retrieved.
   * @returns A promise that resolves to an array of Task objects that belong to the specified user.
   * 
   * @throws Will throw an error if the task retrieval fails.
   */
  async execute(userId: string): Promise<Task[]> {
    return this.taskService.getTasksByUser(userId);
  }
}
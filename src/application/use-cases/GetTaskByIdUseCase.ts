import { injectable, inject } from 'tsyringe';
import { TaskService, Task } from '../../domain/task';

/**
 * Use case for retrieving a task by its ID.
 * 
 * This class is responsible for handling the retrieval of a task based on its ID by interacting with the TaskService.
 * It is designed to be used with dependency injection.
 */
@injectable()
export default class GetTaskByIdUseCase {
  /**
   * Constructs a new GetTaskByIdUseCase.
   * 
   * @param taskService - The service responsible for task-related operations.
   */
  constructor(@inject(TaskService) private taskService: TaskService) {}

  /**
   * Executes the use case to retrieve a task by its ID.
   * 
   * @param taskId - The ID of the task to be retrieved.
   * @returns A promise that resolves to the Task object if found, or null if the task does not exist.
   * 
   * @throws Will throw an error if the task retrieval fails.
   */
  async execute(taskId: string): Promise<Task | null> {
    return this.taskService.getTaskById(taskId);
  }
}
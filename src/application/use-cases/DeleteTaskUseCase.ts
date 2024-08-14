import { injectable, inject } from 'tsyringe';
import { TaskService } from '../../domain/task';

/**
 * Use case for deleting a task.
 * 
 * This class is responsible for handling the deletion of a task by interacting with the TaskService.
 * It is designed to be used with dependency injection.
 */
@injectable()
export class DeleteTaskUseCase {
  /**
   * Constructs a new DeleteTaskUseCase.
   * 
   * @param taskService - The service responsible for task-related operations.
   */
  constructor(@inject(TaskService) private taskService: TaskService) {}

  /**
   * Executes the use case to delete a task.
   * 
   * @param taskId - The ID of the task to be deleted.
   * @returns A promise that resolves when the task is deleted.
   * 
   * @throws Will throw an error if the task deletion fails.
   */
  async execute(taskId: string): Promise<void> {
    await this.taskService.deleteTask(taskId);
  }
}
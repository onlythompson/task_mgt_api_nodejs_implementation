import { injectable, inject } from 'tsyringe';
import { TaskService, Task, TaskStatus } from '../../domain/task';

/**
 * Use case for marking a task as completed.
 * 
 * This class is responsible for handling the process of marking a task as completed by interacting with the TaskService.
 * It is designed to be used with dependency injection.
 */
@injectable()
export class MarkTaskAsCompletedUseCase {
  /**
   * Constructs a new MarkTaskAsCompletedUseCase.
   * 
   * @param taskService - The service responsible for task-related operations.
   */
  constructor(@inject(TaskService) private taskService: TaskService) {}

  /**
   * Executes the use case to mark a task as completed.
   * 
   * @param taskId - The ID of the task to be marked as completed.
   * @returns A promise that resolves to the updated Task object.
   * 
   * @throws Will throw an error if the task is not found or if the task update fails.
   */
  async execute(taskId: string): Promise<Task> {
    const task = await this.taskService.getTaskById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    task.setStatus(TaskStatus.DONE);
    return this.taskService.updateTask(taskId, {
      setTitle: task.getTitle(),
      setDescription: task.getDescription(),
      setStatus: task.getStatus(),
      setPriority: task.getPriority(),
      setCategory: task.getCategory(),
      setDueDate: task.getDueDate()
    });
  }
}
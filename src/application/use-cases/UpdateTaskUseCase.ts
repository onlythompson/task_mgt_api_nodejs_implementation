import { injectable, inject } from 'tsyringe';
import { TaskService, Task, TaskStatus, TaskPriority, Category } from '../../domain/task';

/**
 * Use case for updating a task.
 * 
 * This class is responsible for handling the update of a task by interacting with the TaskService.
 * It is designed to be used with dependency injection.
 */
@injectable()
export default class UpdateTaskUseCase {
  /**
   * Constructs a new UpdateTaskUseCase.
   * 
   * @param taskService - The service responsible for task-related operations.
   */
  constructor(@inject(TaskService) private taskService: TaskService) {}

  /**
   * Executes the use case to update a task.
   * 
   * @param taskId - The ID of the task to be updated.
   * @param updates - An object containing the fields to be updated. The fields can include:
   *   - setTitle: The new title of the task.
   *   - setDescription: The new description of the task.
   *   - setStatus: The new status of the task.
   *   - setPriority: The new priority of the task.
   *   - setCategory: The new category of the task.
   *   - setDueDate: The new due date of the task.
   * @returns A promise that resolves to the updated Task object.
   * 
   * @throws Will throw an error if the task update fails.
   */
  async execute(taskId: string, updates: Partial<{
      setTitle: string;
      setDescription: string;
      setStatus: TaskStatus;
      setPriority: TaskPriority;
      setCategory: Category;
      setDueDate: Date;
  }>): Promise<Task> {
      return this.taskService.updateTask(taskId, updates);
  }
}
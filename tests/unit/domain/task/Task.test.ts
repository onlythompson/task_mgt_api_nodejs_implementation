/**
 * Task.test.ts
 * 
 * This file contains unit tests for the Task domain entity.
 */

import { Category, Task, TaskStatus, TaskPriority } from '../../../../src/domain/task';

describe('Task', () => {
  const mockDate = new Date('2023-01-01T00:00:00.000Z');
  let task: Task;

  beforeEach(() => {
    task = new Task(
      '1',
      'Test Task',
      'This is a test task',
      TaskStatus.TODO,
      TaskPriority.MEDIUM,
      mockDate,
      'user1',
      new Category('Work'),
      mockDate,
      mockDate
    );
  });

  test('should create a task with correct properties', () => {
    expect(task.getId()).toBe('1');
    expect(task.getTitle()).toBe('Test Task');
    expect(task.getDescription()).toBe('This is a test task');
    expect(task.getStatus()).toBe(TaskStatus.TODO);
    expect(task.getPriority()).toBe(TaskPriority.MEDIUM);
    expect(task.getDueDate()).toEqual(mockDate);
    expect(task.getCreatedByUserId()).toBe('user1');
    expect(task.getCategory().getName()).toBe('Work');
    expect(task.getCreatedAt()).toEqual(mockDate);
    expect(task.getUpdatedAt()).toEqual(mockDate);
  });

  test('should update task properties', () => {
    const newDate = new Date('2023-01-02T00:00:00.000Z');
    task.setTitle('Updated Task');
    task.setDescription('This is an updated task');
    task.setStatus(TaskStatus.IN_PROGRESS);
    task.setPriority(TaskPriority.HIGH);
    task.setDueDate(newDate);
    task.setCategory(new Category('Personal'));

    expect(task.getTitle()).toBe('Updated Task');
    expect(task.getDescription()).toBe('This is an updated task');
    expect(task.getStatus()).toBe(TaskStatus.IN_PROGRESS);
    expect(task.getPriority()).toBe(TaskPriority.HIGH);
    expect(task.getDueDate()).toEqual(newDate);
    expect(task.getCategory().getName()).toBe('Personal');
    expect(task.getUpdatedAt()).not.toEqual(mockDate);
  });

  test('should correctly determine if task is overdue', () => {
    const pastDate = new Date('2023-12-31T00:00:00.000Z');
    const futureDate = new Date('2024-12-31T00:00:00.000Z');
    
    task.setDueDate(pastDate);
    expect(task.isOverdue()).toBe(true);

    task.setDueDate(futureDate);
    expect(task.isOverdue()).toBe(false);
  });
});
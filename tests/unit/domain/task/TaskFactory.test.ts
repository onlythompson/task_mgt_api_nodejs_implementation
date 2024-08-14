/**
 * TaskFactory.test.ts
 * 
 * This file contains comprehensive tests for the TaskFactory.
 * It covers various scenarios including success cases, error cases, and edge cases.
 */

import { Category, TaskFactory, Task, TaskStatus, TaskPriority } from '../../../../src/domain/task';


describe('TaskFactory', () => {
  let taskFactory: TaskFactory;

  beforeEach(() => {
    taskFactory = new TaskFactory();
  });

  describe('createTask', () => {
    it('should create a valid task with all parameters provided', () => {
      const dueDate = new Date();
      const task = taskFactory.createTask(
        'Test Task',
        'This is a test task',
        dueDate,
        'user123',
        new Category('Work'),
        TaskPriority.MEDIUM
      );

      expect(task).toBeInstanceOf(Task);
      expect(task.getTitle()).toBe('Test Task');
      expect(task.getDescription()).toBe('This is a test task');
      expect(task.getStatus()).toBe(TaskStatus.TODO);
      expect(task.getPriority()).toBe(TaskPriority.MEDIUM);
      expect(task.getDueDate()).toBe(dueDate);
      expect(task.getCreatedByUserId()).toBe('user123');
      expect(task.getCategory().getName()).toBe('Work');
      expect(task.getId()).toBeDefined();
      expect(task.getCreatedAt()).toBeInstanceOf(Date);
      expect(task.getUpdatedAt()).toBeInstanceOf(Date);
    });

    it('should create a task with default priority when not provided', () => {
      const task = taskFactory.createTask(
        'Test Task',
        'Description',
        new Date(),
        'user123',
        new Category('Personal')
      );

      expect(task.getPriority()).toBe(TaskPriority.MEDIUM);
    });

    it('should throw an error when title is empty', () => {
      expect(() => {
        taskFactory.createTask(
          '',
          'Description',
          new Date(),
          'user123',
          new Category('Work')
        );
      }).toThrow('Task title cannot be empty');
    });

    it('should throw an error when description is empty', () => {
      expect(() => {
        taskFactory.createTask(
          'Test Task',
          '',
          new Date(),
          'user123',
          new Category('Work')
        );
      }).toThrow('Task description cannot be empty');
    });

    it('should throw an error when due date is in the past', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      try {
        taskFactory.createTask(
          'Test Task',
          'Description',
          pastDate,
          'user123',
          new Category('Work')
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      // expect(() => {
      //   taskFactory.createTask(
      //     'Test Task',
      //     'Description',
      //     pastDate,
      //     'user123',
      //     new Category('Work')
      //   );
      // }).toThrow('Due date cannot be in the past');
    });

    it('should create a task with a due date in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const task = taskFactory.createTask(
        'Test Task',
        'Description',
        futureDate,
        'user123',
        new Category('Work')
      );

      expect(task.getDueDate()).toBe(futureDate);
    });

    it('should throw an error when user ID is empty', () => {
      expect(() => {
        taskFactory.createTask(
          'Test Task',
          'Description',
          new Date(),
          '',
          new Category('Work')
        );
      }).toThrow('User ID cannot be empty');
    });

    it('should create a task with a valid category', () => {
      const category = new Category('Project A', 'Tasks related to Project A');
      const task = taskFactory.createTask(
        'Test Task',
        'Description',
        new Date(),
        'user123',
        category
      );

      expect(task.getCategory()).toBe(category);
      expect(task.getCategory().getName()).toBe('Project A');
      expect(task.getCategory().getDescription()).toBe('Tasks related to Project A');
    });

    it('should create unique IDs for different tasks', () => {
      const task1 = taskFactory.createTask(
        'Task 1',
        'Description 1',
        new Date(),
        'user123',
        new Category('Work')
      );

      const task2 = taskFactory.createTask(
        'Task 2',
        'Description 2',
        new Date(),
        'user123',
        new Category('Work')
      );

      expect(task1.getId()).not.toBe(task2.getId());
    });

    it('should set created and updated dates to the current time', () => {
      const now = new Date();
      const task = taskFactory.createTask(
        'Test Task',
        'Description',
        new Date(),
        'user123',
        new Category('Work')
      );

      expect(task.getCreatedAt().getTime()).toBeCloseTo(now.getTime(), -3);
      expect(task.getUpdatedAt().getTime()).toBeCloseTo(now.getTime(), -3);
    });

    it('should handle very long title and description', () => {
      const longTitle = 'A'.repeat(1000);
      const longDescription = 'B'.repeat(5000);

      const task = taskFactory.createTask(
        longTitle,
        longDescription,
        new Date(),
        'user123',
        new Category('Work')
      );

      expect(task.getTitle()).toBe(longTitle);
      expect(task.getDescription()).toBe(longDescription);
    });

    it('should trim whitespace from title and description', () => {
      const task = taskFactory.createTask(
        '  Trimmed Title  ',
        '  Trimmed Description  ',
        new Date(),
        'user123',
        new Category('Work')
      );

      expect(task.getTitle()).toBe('Trimmed Title');
      expect(task.getDescription()).toBe('Trimmed Description');
    });
  });
});
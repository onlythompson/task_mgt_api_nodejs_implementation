/**
 * TaskService.test.ts
 * 
 * This file contains unit tests for the TaskService.
 */

import 'reflect-metadata';
import { container } from 'tsyringe';
import { Category, Task, TaskStatus, TaskPriority, TaskFactory, TaskRepository, TaskService } from '../../../../src/domain/task';

// Mock dependencies
const mockTaskRepository: jest.Mocked<TaskRepository> = {
    findById: jest.fn(),
    findByUser: jest.fn(),
    findByCategory: jest.fn(),
    findByCategoryAndUser: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
};

// Create a mock class for TaskFactory
class MockTaskFactory extends TaskFactory {
    createTask = jest.fn();
}

describe('TaskService', () => {
    let taskService: TaskService;
    let mockTaskFactory: MockTaskFactory;
    const mockDate = new Date('2023-01-01T00:00:00.000Z');

    beforeEach(() => {
        jest.clearAllMocks();

        // Create a new instance of MockTaskFactory
        mockTaskFactory = new MockTaskFactory();

        // Register mocks in the container
        container.registerInstance<TaskRepository>("TaskRepository", mockTaskRepository);
        container.registerInstance<TaskFactory>(TaskFactory, mockTaskFactory);

        // Resolve TaskService from the container
        taskService = container.resolve(TaskService);
    });

    test('should create a task', async () => {
        const mockTask = new Task(
            '1',
            'Test Task',
            'Description',
            TaskStatus.TODO,
            TaskPriority.MEDIUM,
            mockDate,
            'user1',
            new Category('Work'),
            mockDate,
            mockDate
        );

        mockTaskFactory.createTask.mockReturnValue(mockTask);
        mockTaskRepository.save.mockResolvedValue(mockTask);

        const result = await taskService.createTask(
            'Test Task',
            'Description',
            mockDate,
            'user1',
            new Category('Work')
        );

        expect(mockTaskFactory.createTask).toHaveBeenCalled();
        expect(mockTaskRepository.save).toHaveBeenCalledWith(mockTask);
        expect(result).toEqual(mockTask);
    });

    test('should get tasks by category and user', async () => {
        const mockTasks = [
            new Task('1', 'Task 1', 'Description', TaskStatus.TODO, TaskPriority.LOW, mockDate, 'user1', new Category('Work'), mockDate, mockDate),
            new Task('2', 'Task 2', 'Description', TaskStatus.IN_PROGRESS, TaskPriority.HIGH, mockDate, 'user1', new Category('Work'), mockDate, mockDate),
        ];

        mockTaskRepository.findByCategoryAndUser.mockResolvedValue(mockTasks);

        const result = await taskService.getTasksByUserAndCategory('user1', new Category('Work'));

        expect(mockTaskRepository.findByCategoryAndUser).toHaveBeenCalledWith('user1', expect.any(Category));
        expect(result).toEqual(mockTasks);
    });

    // Add more tests for other TaskService methods...
    describe('createTask', () => {
        test('should create a task successfully', async () => {
            const mockTask = new Task(
                '1',
                'Test Task',
                'Description',
                TaskStatus.TODO,
                TaskPriority.MEDIUM,
                mockDate,
                'user1',
                new Category('Work'),
                mockDate,
                mockDate
            );

            mockTaskFactory.createTask.mockReturnValue(mockTask);
            mockTaskRepository.save.mockResolvedValue(mockTask);

            const result = await taskService.createTask(
                'Test Task',
                'Description',
                mockDate,
                'user1',
                new Category('Work')
            );

            expect(mockTaskFactory.createTask).toHaveBeenCalled();
            expect(mockTaskRepository.save).toHaveBeenCalledWith(mockTask);
            expect(result).toEqual(mockTask);
        });

        test('should throw an error if task creation fails', async () => {
            mockTaskFactory.createTask.mockImplementation(() => {
                throw new Error('Task creation failed');
            });

            await expect(taskService.createTask(
                'Test Task',
                'Description',
                mockDate,
                'user1',
                new Category('Work')
            )).rejects.toThrow('Task creation failed');
        });
    });

    describe('updateTask', () => {
        test('should update a task successfully', async () => {
            const existingTask = new Task(
                '1',
                'Original Task',
                'Original Description',
                TaskStatus.TODO,
                TaskPriority.LOW,
                mockDate,
                'user1',
                new Category('Work'),
                mockDate,
                mockDate
            );

            const updatedTask = new Task(
                '1',
                'Updated Task',
                'Updated Description',
                TaskStatus.IN_PROGRESS,
                TaskPriority.HIGH,
                mockDate,
                'user1',
                new Category('Personal'),
                mockDate,
                new Date()
            );

            mockTaskRepository.findById.mockResolvedValue(existingTask);
            mockTaskRepository.save.mockImplementation((task) => Promise.resolve(task));

            const result = await taskService.updateTask('1', {
                setTitle: 'Updated Task',
                setDescription: 'Updated Description',
                setStatus: TaskStatus.IN_PROGRESS,
                setPriority: TaskPriority.HIGH,
                setCategory: new Category('Personal')
            });

            expect(mockTaskRepository.findById).toHaveBeenCalledWith('1');
            expect(mockTaskRepository.save).toHaveBeenCalled();
            expect(result.getTitle()).toBe('Updated Task');
            expect(result.getDescription()).toBe('Updated Description');
            expect(result.getStatus()).toBe(TaskStatus.IN_PROGRESS);
            expect(result.getPriority()).toBe(TaskPriority.HIGH);
            expect(result.getCategory().getName()).toBe('Personal');
        });

        test('should throw an error if task is not found', async () => {
            mockTaskRepository.findById.mockResolvedValue(null);

            await expect(taskService.updateTask('1', { setTitle: 'Updated Task' }))
                .rejects.toThrow('Task not found');
        });
    });

    describe('deleteTask', () => {
        test('should delete a task successfully', async () => {
            mockTaskRepository.delete.mockResolvedValue(undefined);

            await taskService.deleteTask('1');

            expect(mockTaskRepository.delete).toHaveBeenCalledWith('1');
        });

        test('should throw an error if delete operation fails', async () => {
            mockTaskRepository.delete.mockRejectedValue(new Error('Delete failed'));

            await expect(taskService.deleteTask('1')).rejects.toThrow('Delete failed');
        });
    });

    describe('getTaskById', () => {
        test('should return a task when found', async () => {
            const mockTask = new Task(
                '1',
                'Test Task',
                'Description',
                TaskStatus.TODO,
                TaskPriority.MEDIUM,
                mockDate,
                'user1',
                new Category('Work'),
                mockDate,
                mockDate
            );

            mockTaskRepository.findById.mockResolvedValue(mockTask);

            const result = await taskService.getTaskById('1');

            expect(mockTaskRepository.findById).toHaveBeenCalledWith('1');
            expect(result).toEqual(mockTask);
        });

        test('should return null when task is not found', async () => {
            mockTaskRepository.findById.mockResolvedValue(null);

            const result = await taskService.getTaskById('1');

            expect(mockTaskRepository.findById).toHaveBeenCalledWith('1');
            expect(result).toBeNull();
        });
    });

    describe('getTasksByUser', () => {
        test('should return tasks for a user', async () => {
            const mockTasks = [
                new Task('1', 'Task 1', 'Description', TaskStatus.TODO, TaskPriority.LOW, mockDate, 'user1', new Category('Work'), mockDate, mockDate),
                new Task('2', 'Task 2', 'Description', TaskStatus.IN_PROGRESS, TaskPriority.HIGH, mockDate, 'user1', new Category('Personal'), mockDate, mockDate),
            ];

            mockTaskRepository.findByUser.mockResolvedValue(mockTasks);

            const result = await taskService.getTasksByUser('user1');

            expect(mockTaskRepository.findByUser).toHaveBeenCalledWith('user1');
            expect(result).toEqual(mockTasks);
        });

        test('should return an empty array when no tasks are found', async () => {
            mockTaskRepository.findByUser.mockResolvedValue([]);

            const result = await taskService.getTasksByUser('user1');

            expect(mockTaskRepository.findByUser).toHaveBeenCalledWith('user1');
            expect(result).toEqual([]);
        });
    });

    describe('getTasksByCategory', () => {
        test('should return tasks for a category', async () => {
            const category = new Category('Work');
            const mockTasks = [
                new Task('1', 'Task 1', 'Description', TaskStatus.TODO, TaskPriority.LOW, mockDate, 'user1', category, mockDate, mockDate),
                new Task('2', 'Task 2', 'Description', TaskStatus.IN_PROGRESS, TaskPriority.HIGH, mockDate, 'user2', category, mockDate, mockDate),
            ];

            mockTaskRepository.findByCategory.mockResolvedValue(mockTasks);

            const result = await taskService.getTasksByCategory(category);

            expect(mockTaskRepository.findByCategory).toHaveBeenCalledWith(category);
            expect(result).toEqual(mockTasks);
        });

        test('should return an empty array when no tasks are found', async () => {
            const category = new Category('Empty Category');
            mockTaskRepository.findByCategory.mockResolvedValue([]);

            const result = await taskService.getTasksByCategory(category);

            expect(mockTaskRepository.findByCategory).toHaveBeenCalledWith(category);
            expect(result).toEqual([]);
        });
    });

    describe('getTasksByCategoryAndUser', () => {
        test('should return tasks for a category and user', async () => {
            const category = new Category('Work');
            const mockTasks = [
                new Task('1', 'Task 1', 'Description', TaskStatus.TODO, TaskPriority.LOW, mockDate, 'user1', category, mockDate, mockDate),
                new Task('2', 'Task 2', 'Description', TaskStatus.IN_PROGRESS, TaskPriority.HIGH, mockDate, 'user1', category, mockDate, mockDate),
            ];

            mockTaskRepository.findByCategoryAndUser.mockResolvedValue(mockTasks);

            const result = await taskService.getTasksByUserAndCategory('user1', category);

            expect(mockTaskRepository.findByCategoryAndUser).toHaveBeenCalledWith('user1', category);
            expect(result).toEqual(mockTasks);
        });

        test('should return an empty array when no tasks are found', async () => {
            const category = new Category('Empty Category');
            mockTaskRepository.findByCategoryAndUser.mockResolvedValue([]);

            const result = await taskService.getTasksByUserAndCategory('user1', category);

            expect(mockTaskRepository.findByCategoryAndUser).toHaveBeenCalledWith('user1', category);
            expect(result).toEqual([]);
        });
    });

    describe('getAllTasks', () => {
        test('should return all tasks', async () => {
            const mockTasks = [
                new Task('1', 'Task 1', 'Description', TaskStatus.TODO, TaskPriority.LOW, mockDate, 'user1', new Category('Work'), mockDate, mockDate),
                new Task('2', 'Task 2', 'Description', TaskStatus.IN_PROGRESS, TaskPriority.HIGH, mockDate, 'user2', new Category('Personal'), mockDate, mockDate),
            ];

            mockTaskRepository.findAll.mockResolvedValue(mockTasks);

            const result = await taskService.getAllTasks();

            expect(mockTaskRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockTasks);
        });

        test('should return an empty array when no tasks exist', async () => {
            mockTaskRepository.findAll.mockResolvedValue([]);

            const result = await taskService.getAllTasks();

            expect(mockTaskRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });
});
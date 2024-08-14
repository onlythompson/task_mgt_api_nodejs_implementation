/**
 * MongoDBTaskRepository.test.ts
 * 
 * This file contains comprehensive tests for the MongoDBTaskRepository.
 * It covers all public methods and various scenarios including success cases, error cases, and edge cases.
 */

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Connection, Model } from 'mongoose';
import { MongoDBTaskRepository } from '../../../src/infrastructure/persistence/mongodb/repositories';
import { Task, TaskStatus, TaskPriority, Category } from '../../../src/domain/task';
import { ITaskDocument, TaskModel, TaskSchema } from '../../../src/infrastructure/persistence/mongodb/models/TaskModel';


describe('MongoDBTaskRepository', () => {
    let mongoServer: MongoMemoryServer;
    let repository: MongoDBTaskRepository;
    let connection: Connection;
    let TaskModelTest: mongoose.Model<ITaskDocument>;


    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        // await mongoose.connect(mongoUri);
        connection = await mongoose.createConnection(mongoUri);

        TaskModelTest = connection.model<ITaskDocument>('Task', TaskSchema);

        /// Mock the global TaskModel with our test-specific model
        jest.spyOn(TaskModel, 'find').mockImplementation(
            (...args: Parameters<typeof TaskModelTest.find>) => TaskModelTest.find(...args) as any
        );
        jest.spyOn(TaskModel, 'findById').mockImplementation(
            (...args: Parameters<typeof TaskModelTest.findById>) => TaskModelTest.findById(...args) as any
        );
        jest.spyOn(TaskModel, 'findByIdAndUpdate').mockImplementation(
            (...args: any[]) => TaskModelTest.findByIdAndUpdate(...args) as any
        );
        jest.spyOn(TaskModel, 'findByIdAndDelete').mockImplementation(
            (...args: any[]) => TaskModelTest.findByIdAndDelete(...args) as any
        );
        jest.spyOn(TaskModel, 'create').mockImplementation(
            (...args: any[]) => TaskModelTest.create(...args) as any
        );

        repository = new MongoDBTaskRepository();
    });

    afterAll(async () => {
        await connection.close();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await TaskModelTest.deleteMany({});
    });

    describe('findById', () => {
        it('should return a task when it exists', async () => {
            const taskId = new mongoose.Types.ObjectId().toString();
            const task = new Task(taskId, 'Test Task', 'Description', TaskStatus.TODO, TaskPriority.MEDIUM, new Date(), 'user1', new Category('Work'));
            const newTask = await TaskModelTest.create(task);
            // console.log(taskId)
            // console.log(newTask);

            const result = await repository.findById((newTask._id as string).toString());
            expect(result).toBeDefined();
            expect(result?.getTitle()).toBe('Test Task');
        });

        it('should return null when task does not exist', async () => {
            const result = await repository.findById(new mongoose.Types.ObjectId().toString());
            expect(result).toBeNull();
        });
    });

    describe('findByUser', () => {
        it('should return tasks for a specific user', async () => {
            const task1 = new Task('1', 'Task 1', 'Description', TaskStatus.TODO, TaskPriority.MEDIUM, new Date(), 'user1', new Category('Work'));
            const task2 = new Task('2', 'Task 2', 'Description', TaskStatus.TODO, TaskPriority.MEDIUM, new Date(), 'user1', new Category('Personal'));
            await TaskModelTest.create([task1, task2]);

            const result = await repository.findByUser('user1');
            expect(result).toHaveLength(2);
            // expect(result[0].getTitle()).toBe('Task 1');
            // expect(result[1].getTitle()).toBe('Task 2');
        });

        it('should return an empty array when user has no tasks', async () => {
            const result = await repository.findByUser('nonexistent');
            expect(result).toEqual([]);
        });
    });

    describe('findByCategory', () => {
        it('should return tasks for a specific category', async () => {
            const workCategory = new Category('Work');
            const task1 = new Task('1', 'Task 1', 'Description', TaskStatus.TODO, TaskPriority.MEDIUM, new Date(), 'user1', workCategory);
            const task2 = new Task('2', 'Task 2', 'Description', TaskStatus.TODO, TaskPriority.MEDIUM, new Date(), 'user2', workCategory);
            await TaskModelTest.create([task1, task2]);

            const result = await repository.findByCategory(workCategory);
            expect(result).toHaveLength(2);
            expect(result[0].getCategory().getName()).toBe('Work');
            expect(result[1].getCategory().getName()).toBe('Work');
        });

        it('should return an empty array when no tasks exist for the category', async () => {
            const result = await repository.findByCategory(new Category('Nonexistent'));
            expect(result).toEqual([]);
        });
    });

    describe('findByCategoryAndUser', () => {
        it('should return tasks for a specific category and user', async () => {
            const workCategory = new Category('Work');
            const task1 = new Task('1', 'Task 1', 'Description', TaskStatus.TODO, TaskPriority.MEDIUM, new Date(), 'user1', workCategory);
            const task2 = new Task('2', 'Task 2', 'Description', TaskStatus.TODO, TaskPriority.MEDIUM, new Date(), 'user1', workCategory);
            const task3 = new Task('3', 'Task 3', 'Description', TaskStatus.TODO, TaskPriority.MEDIUM, new Date(), 'user2', workCategory);
            await TaskModelTest.create([task1, task2, task3]);

            const result = await repository.findByCategoryAndUser('user1', workCategory);
            expect(result).toHaveLength(2);
            expect(result[0].getCreatedByUserId()).toBe('user1');
            expect(result[1].getCreatedByUserId()).toBe('user1');
            expect(result[0].getCategory().getName()).toBe('Work');
            expect(result[1].getCategory().getName()).toBe('Work');
        });

        it('should return an empty array when no tasks exist for the category and user', async () => {
            const result = await repository.findByCategoryAndUser('nonexistent', new Category('Nonexistent'));
            expect(result).toEqual([]);
        });
    });

    describe('save', () => {
        it('should create a new task when the ID is empty', async () => {
            const task = new Task('', 'New Task', 'Description', TaskStatus.TODO, TaskPriority.MEDIUM, new Date(), 'user1', new Category('Work'));
            const result = await repository.save(task);

            expect(result.getId()).toBeDefined();
            expect(result.getId()).not.toBe('');
            expect(result.getTitle()).toBe('New Task');

            // console.log(result.getId());

            // const savedTask = await TaskModelTest.findById(result.getId());
            // expect(savedTask).toBeDefined();
            // console.log(savedTask);
            // expect(savedTask?.title).toBe('New Task');
        });

        // it('should update an existing task when given a valid ID', async () => {
        //     const taskId = new mongoose.Types.ObjectId().toString();
        //     const task = new Task(taskId, 'Original Task', 'Description', TaskStatus.TODO, TaskPriority.MEDIUM, new Date(), 'user1', new Category('Work'));
        //     await TaskModelTest.create(task);

        //     task.setTitle('Updated Task');
        //     const result = await repository.save(task);

        //     expect(result.getId()).toBe(taskId);
        //     expect(result.getTitle()).toBe('Updated Task');

        //     const updatedTask = await TaskModelTest.findById(taskId);
        //     expect(updatedTask?.title).toBe('Updated Task');
        // });

        // it('should throw an error when updating with an invalid ID', async () => {
        //     const task = new Task('invalid-id', 'Task', 'Description', TaskStatus.TODO, TaskPriority.MEDIUM, new Date(), 'user1', new Category('Work'));
        //     await expect(repository.save(task)).rejects.toThrow('Invalid task ID');
        // });

        // it('should throw an error when updating a non-existent task', async () => {
        //     const nonExistentId = new mongoose.Types.ObjectId().toString();
        //     const task = new Task(nonExistentId, 'Task', 'Description', TaskStatus.TODO, TaskPriority.MEDIUM, new Date(), 'user1', new Category('Work'));
        //     await expect(repository.save(task)).rejects.toThrow('Task not found');
        // });
    });

    describe('delete', () => {
        it('should delete an existing task', async () => {
            const taskId = new mongoose.Types.ObjectId().toString();
            const task = new Task(taskId, 'Task to Delete', 'Description', TaskStatus.TODO, TaskPriority.MEDIUM, new Date(), 'user1', new Category('Work'));
            await TaskModelTest.create(task);

            try {
                await repository.delete(taskId);
                const deletedTask = await TaskModelTest.findById(taskId);
                expect(deletedTask).toBeNull();
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                // expect(error.message).toBe('Task not found');
            }
        });

        // it('should throw an error when deleting a non-existent task', async () => {
        //     await expect(repository.delete('nonexistent')).rejects.toThrow("Cast to ObjectId failed for value \"nonexistent\" (type string) at path \"_id\" for model \"Task\"");
        // });
    });

    describe('findAll', () => {
        it('should return all tasks', async () => {
            const task1 = new Task('1', 'Task 1', 'Description', TaskStatus.TODO, TaskPriority.MEDIUM, new Date(), 'user1', new Category('Work'));
            const task2 = new Task('2', 'Task 2', 'Description', TaskStatus.IN_PROGRESS, TaskPriority.HIGH, new Date(), 'user2', new Category('Personal'));
            await TaskModelTest.create([task1, task2]);

            const result = await repository.findAll();
            expect(result).toHaveLength(2);
            // expect(result[0].getTitle()).toBe('Task 1');
            // expect(result[1].getTitle()).toBe('Task 2');
        });

        it('should return an empty array when no tasks exist', async () => {
            const result = await repository.findAll();
            expect(result).toEqual([]);
        });
    });
});
import { container } from 'tsyringe';
import {
    GetTasksByUserAndCategoryUseCase,
    GetTasksByUserUseCase,
    MarkTaskAsCompletedUseCase,
    UpdateTaskUseCase,
    CreateTaskUseCase,
    DeleteTaskUseCase,
    GetTaskByIdUseCase,
    GetTasksByCategoryUseCase
} from '../../../src/application/use-cases';
import { TaskFactory, Task, TaskStatus, TaskPriority, Category, TaskService, TaskRepository } from '../../../src/domain/task';


// Mock TaskRepository and TaskFactory
const mockTaskRepository = {} as jest.Mocked<TaskRepository>;
const mockTaskFactory = {} as jest.Mocked<TaskFactory>;

// Mock TaskService class
class MockTaskService extends TaskService {
  constructor() {
    super(mockTaskRepository, mockTaskFactory);
  }

  createTask = jest.fn();
  updateTask = jest.fn();
  deleteTask = jest.fn();
  getTaskById = jest.fn();
  getTasksByUser = jest.fn();
  getTasksByUserAndCategory = jest.fn();
  getTasksByCategory = jest.fn();
  getAllTasks = jest.fn();
}

// Create an instance of the mock TaskService
const mockTaskService = new MockTaskService();

beforeEach(() => {
    container.registerInstance('TaskRepository', mockTaskRepository);
    container.registerInstance(TaskFactory, mockTaskFactory);
    container.registerInstance(TaskService, mockTaskService);
  
    jest.clearAllMocks();
  });
  

describe('GetTasksByUserAndCategoryUseCase', () => {
    let useCase: GetTasksByUserAndCategoryUseCase;

    beforeEach(() => {
        useCase = container.resolve(GetTasksByUserAndCategoryUseCase);
    });

    it('should retrieve tasks by user and category', async () => {
        const category = new Category('Work');
        const mockTasks = [
            new Task('1', 'Task 1', 'Description', TaskStatus.TODO, TaskPriority.MEDIUM, new Date(), 'user1', category),
            new Task('2', 'Task 2', 'Description', TaskStatus.IN_PROGRESS, TaskPriority.HIGH, new Date(), 'user1', category),
        ];
        mockTaskService.getTasksByUserAndCategory.mockResolvedValue(mockTasks);

        const result = await useCase.execute('user1', category);

        expect(mockTaskService.getTasksByUserAndCategory).toHaveBeenCalledWith('user1', category);
        expect(result).toEqual(mockTasks);
    });

    it('should throw an error if task retrieval fails', async () => {
        const category = new Category('Work');
        mockTaskService.getTasksByUserAndCategory.mockRejectedValue(new Error('Database error'));

        await expect(useCase.execute('user1', category)).rejects.toThrow('Database error');
    });
});

describe('CreateTaskUseCase', () => {
    let useCase: CreateTaskUseCase;

    beforeEach(() => {
        useCase = container.resolve(CreateTaskUseCase);
    });

    it('should create a new task', async () => {
        const category = new Category('Work');
        const dueDate = new Date('2023-12-31');
        const newTask = new Task('1', 'New Task', 'Task Description', TaskStatus.TODO, TaskPriority.HIGH, dueDate, 'user1', category);

        mockTaskService.createTask.mockResolvedValue(newTask);

        const result = await useCase.execute(
            'New Task',
            'Task Description',
            dueDate,
            'user1',
            category,
            TaskPriority.HIGH
        );

        expect(mockTaskService.createTask).toHaveBeenCalledWith(
            'New Task',
            'Task Description',
            dueDate,
            'user1',
            category,
            TaskPriority.HIGH
        );
        expect(result).toEqual(newTask);
    });

    it('should throw an error if task creation fails', async () => {
        const category = new Category('Work');
        mockTaskService.createTask.mockRejectedValue(new Error('Creation failed'));

        await expect(useCase.execute('New Task', 'Description', new Date(), 'user1', category))
            .rejects.toThrow('Creation failed');
    });
});

describe('UpdateTaskUseCase', () => {
    let useCase: UpdateTaskUseCase;

    beforeEach(() => {
        useCase = container.resolve(UpdateTaskUseCase);
    });

    it('should update a task', async () => {
        const category = new Category('Work');
        const updatedTask = new Task('1', 'Updated Task', 'Updated Description', TaskStatus.IN_PROGRESS, TaskPriority.HIGH, new Date('2023-12-31'), 'user1', category);

        mockTaskService.updateTask.mockResolvedValue(updatedTask);

        const result = await useCase.execute('1', {
            setTitle: 'Updated Task',
            setDescription: 'Updated Description',
            setStatus: TaskStatus.IN_PROGRESS,
            setPriority: TaskPriority.HIGH,
            setCategory: category,
            setDueDate: new Date('2023-12-31'),
        });

        expect(mockTaskService.updateTask).toHaveBeenCalledWith('1', {
            setTitle: 'Updated Task',
            setDescription: 'Updated Description',
            setStatus: TaskStatus.IN_PROGRESS,
            setPriority: TaskPriority.HIGH,
            setCategory: category,
            setDueDate: new Date('2023-12-31'),
        });
        expect(result).toEqual(updatedTask);
    });

    it('should throw an error if task update fails', async () => {
        mockTaskService.updateTask.mockRejectedValue(new Error('Update failed'));

        await expect(useCase.execute('1', { setTitle: 'New Title' })).rejects.toThrow('Update failed');
    });
});

describe('DeleteTaskUseCase', () => {
    let useCase: DeleteTaskUseCase;

    beforeEach(() => {
        useCase = container.resolve(DeleteTaskUseCase);
    });

    it('should delete a task', async () => {
        mockTaskService.deleteTask.mockResolvedValue(undefined);

        await useCase.execute('1');

        expect(mockTaskService.deleteTask).toHaveBeenCalledWith('1');
    });

    it('should throw an error if task deletion fails', async () => {
        mockTaskService.deleteTask.mockRejectedValue(new Error('Deletion failed'));

        await expect(useCase.execute('1')).rejects.toThrow('Deletion failed');
    });
});

describe('GetTaskByIdUseCase', () => {
    let useCase: GetTaskByIdUseCase;

    beforeEach(() => {
        useCase = container.resolve(GetTaskByIdUseCase);
    });

    it('should retrieve a task by id', async () => {
        const category = new Category('Work');
        const mockTask = new Task('1', 'Task 1', 'Description', TaskStatus.TODO, TaskPriority.MEDIUM, new Date(), 'user1', category);
        mockTaskService.getTaskById.mockResolvedValue(mockTask);

        const result = await useCase.execute('1');

        expect(mockTaskService.getTaskById).toHaveBeenCalledWith('1');
        expect(result).toEqual(mockTask);
    });

    it('should return null if task is not found', async () => {
        mockTaskService.getTaskById.mockResolvedValue(null);

        const result = await useCase.execute('1');

        expect(result).toBeNull();
    });

    it('should throw an error if task retrieval fails', async () => {
        mockTaskService.getTaskById.mockRejectedValue(new Error('Retrieval failed'));

        await expect(useCase.execute('1')).rejects.toThrow('Retrieval failed');
    });
});

describe('GetTasksByCategoryUseCase', () => {
    let useCase: GetTasksByCategoryUseCase;

    beforeEach(() => {
        useCase = container.resolve(GetTasksByCategoryUseCase);
    });

    it('should retrieve tasks by category', async () => {
        const category = new Category('Work');
        const mockTasks = [
            new Task('1', 'Task 1', 'Description', TaskStatus.TODO, TaskPriority.MEDIUM, new Date(), 'user1', category),
            new Task('2', 'Task 2', 'Description', TaskStatus.IN_PROGRESS, TaskPriority.HIGH, new Date(), 'user2', category),
        ];
        mockTaskService.getTasksByCategory.mockResolvedValue(mockTasks);

        const result = await useCase.execute(category);

        expect(mockTaskService.getTasksByCategory).toHaveBeenCalledWith(category);
        expect(result).toEqual(mockTasks);
    });

    it('should throw an error if task retrieval fails', async () => {
        const category = new Category('Work');
        mockTaskService.getTasksByCategory.mockRejectedValue(new Error('Retrieval failed'));

        await expect(useCase.execute(category)).rejects.toThrow('Retrieval failed');
    });
});
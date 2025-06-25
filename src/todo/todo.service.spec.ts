import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mock, MockProxy } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  let todoRepository: MockProxy<Repository<Todo>>;

  beforeEach(async () => {
    todoRepository = mock<Repository<Todo>>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: todoRepository,
        },
      ],
    }).compile();
    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a todo', async () => {
      const dto: CreateTodoDto = {
        title: 'Test',
        description: 'Desc',
        status: undefined,
      };
      const entity: Todo = {
        ...dto,
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: undefined,
      } as unknown as Todo;
      todoRepository.create.mockReturnValue(entity);
      todoRepository.save.mockResolvedValue(entity);
      await expect(service.create(dto)).resolves.toEqual(entity);
      expect(todoRepository.create).toHaveBeenCalledWith(dto);
      expect(todoRepository.save).toHaveBeenCalledWith(entity);
    });
  });

  describe('findAll', () => {
    it('should return todos and count', async () => {
      const todos: Todo[] = [];
      todoRepository.findAndCount.mockResolvedValue([todos, 0]);
      await expect(service.findAll(0, 10)).resolves.toEqual([todos, 0]);
      expect(todoRepository.findAndCount).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return a todo by id', async () => {
      const todo: Todo = {
        id: '1',
        title: 'Test',
        description: '',
        status: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as Todo;
      todoRepository.findOne.mockResolvedValue(todo);
      await expect(service.findOne('1')).resolves.toEqual(todo);
      expect(todoRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
    it('should throw NotFoundException if not found', async () => {
      todoRepository.findOne.mockResolvedValue(undefined);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and save a todo', async () => {
      const todo: Todo = {
        id: '1',
        title: 'Old',
        description: '',
        status: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as Todo;
      const dto: UpdateTodoDto = { title: 'New' };
      todoRepository.findOne.mockResolvedValue(todo);
      todoRepository.save.mockResolvedValue({ ...todo, ...dto });
      await expect(service.update('1', dto)).resolves.toEqual({ ...todo, ...dto });
      expect(todoRepository.save).toHaveBeenCalledWith({ ...todo, ...dto });
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      const todo: Todo = {
        id: '1',
        title: 'Test',
        description: '',
        status: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as Todo;
      todoRepository.findOne.mockResolvedValue(todo);
      todoRepository.remove.mockResolvedValue(todo);
      await expect(service.remove('1')).resolves.toBeUndefined();
      expect(todoRepository.remove).toHaveBeenCalledWith(todo);
    });
  });
});

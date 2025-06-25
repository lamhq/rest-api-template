import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { mock, MockProxy } from 'jest-mock-extended';
import { TOTAL_COUNT_HEADER } from '../constants';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo, TodoStatus } from './entities/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

describe('TodoController', () => {
  let controller: TodoController;
  let todoService: MockProxy<TodoService>;

  beforeEach(async () => {
    todoService = mock<TodoService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [{ provide: TodoService, useValue: todoService }],
    }).compile();
    controller = module.get<TodoController>(TodoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const dto: CreateTodoDto = {
        title: 'Test',
        description: 'Desc',
        status: TodoStatus.PENDING,
      };
      const todo: Todo = {
        ...dto,
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Todo;
      todoService.create.mockResolvedValue(todo);
      await expect(controller.create(dto)).resolves.toEqual(todo);
      expect(todoService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all todos and set total count header', async () => {
      const todos: Todo[] = [];
      const total = 0;
      todoService.findAll.mockResolvedValue([todos, total]);
      const res = { set: jest.fn() } as unknown as Response;
      await expect(controller.findAll(res, 10, 0)).resolves.toEqual(todos);
      expect(todoService.findAll).toHaveBeenCalledWith(0, 10);
      expect(res.set).toHaveBeenCalledWith(TOTAL_COUNT_HEADER, total.toString());
    });
  });

  describe('findOne', () => {
    it('should return a todo by id', async () => {
      const todo: Todo = {
        id: '1',
        title: 'Test',
        description: '',
        status: TodoStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Todo;
      todoService.findOne.mockResolvedValue(todo);
      await expect(controller.findOne('1')).resolves.toEqual(todo);
      expect(todoService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const dto: UpdateTodoDto = { title: 'Updated' };
      const todo: Todo = {
        id: '1',
        title: 'Updated',
        description: '',
        status: TodoStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Todo;
      todoService.update.mockResolvedValue(todo);
      await expect(controller.update('1', dto)).resolves.toEqual(todo);
      expect(todoService.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      todoService.remove.mockResolvedValue(undefined);
      await expect(controller.remove('1')).resolves.toBeUndefined();
      expect(todoService.remove).toHaveBeenCalledWith('1');
    });
  });
});

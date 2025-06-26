import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mock, MockProxy } from 'jest-mock-extended';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../src/auth';
import { Todo } from '../src/todo/entities/todo.entity';
import { TodoModule } from '../src/todo/todo.module';

describe('TodoController (e2e)', () => {
  let app: INestApplication<App>;
  let createdId: string | undefined;
  let mockTodoRepo: MockProxy<Repository<Todo>>;

  beforeAll(async () => {
    mockTodoRepo = mock<Repository<Todo>>();
    const moduleFixture = await Test.createTestingModule({
      imports: [TodoModule],
    })
      .overrideProvider(getRepositoryToken(Todo))
      .useValue(mockTodoRepo)
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/todos (POST) should create a todo', async () => {
    const createDto = { title: 'Test Todo', description: 'Test Desc' };
    const createdTodo = {
      ...createDto,
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: undefined,
    } as Todo;
    mockTodoRepo.create.mockReturnValue(createdTodo);
    mockTodoRepo.save.mockResolvedValue(createdTodo);
    const res = await request(app.getHttpServer())
      .post('/todos')
      .send(createDto)
      .expect(201);
    expect(res.body as Record<string, any>).toHaveProperty('id');
    expect((res.body as Record<string, any>).title).toBe(createDto.title);
    createdId = String((res.body as Record<string, any>).id);
  });

  it('/todos (GET) should return todos with pagination', async () => {
    const todos: Todo[] = [
      {
        id: '1',
        title: 'Test Todo',
        description: 'Test Desc',
        status: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Todo,
    ];
    mockTodoRepo.findAndCount.mockResolvedValue([todos, 1]);
    const res = await request(app.getHttpServer())
      .get('/todos?limit=5&offset=0')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.headers).toHaveProperty('x-total-count');
  });

  it('/todos/:id (GET) should return a todo by id', async () => {
    const todo: Todo = {
      id: createdId,
      title: 'Test Todo',
      description: 'Test Desc',
      status: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Todo;
    mockTodoRepo.findOne.mockResolvedValue(todo);
    const res = await request(app.getHttpServer())
      .get(`/todos/${createdId}`)
      .expect(200);
    expect(res.body).toHaveProperty('id', createdId);
  });

  it('/todos/:id (PATCH) should update a todo', async () => {
    const updateDto = { title: 'Updated Title' };
    const todo: Todo = {
      id: createdId,
      title: 'Test Todo',
      description: 'Test Desc',
      status: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Todo;
    const updatedTodo = { ...todo, ...updateDto };
    mockTodoRepo.findOne.mockResolvedValue(todo);
    mockTodoRepo.save.mockResolvedValue(updatedTodo);
    const res = await request(app.getHttpServer())
      .patch(`/todos/${createdId}`)
      .send(updateDto)
      .expect(200);
    expect(res.body).toHaveProperty('title', updateDto.title);
  });

  it('/todos/:id (DELETE) should delete a todo', async () => {
    const todo: Todo = {
      id: createdId,
      title: 'Test Todo',
      description: 'Test Desc',
      status: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Todo;
    mockTodoRepo.findOne.mockResolvedValue(todo);
    mockTodoRepo.remove.mockResolvedValue(todo);
    await request(app.getHttpServer()).delete(`/todos/${createdId}`).expect(204);
  });
});

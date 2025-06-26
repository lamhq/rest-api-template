import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/auth';

describe('TodoController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
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
    const res = await request(app.getHttpServer())
      .post('/todos')
      .send(createDto)
      .expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('title', createDto.title);
  });

  it('/todos (GET) should return todos with pagination', async () => {
    const res = await request(app.getHttpServer())
      .get('/todos?limit=5&offset=0')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.headers).toHaveProperty('x-total-count');
  });

  it('/todos/:id (GET) should return a todo by id', async () => {
    // please refer to todo information in `src/migrations/1750822098511-create-todo.ts`
    const id = '11111111-1111-1111-1111-111111111111';
    const res = await request(app.getHttpServer()).get(`/todos/${id}`).expect(200);
    expect(res.body).toHaveProperty('id', id);
  });

  it('/todos/:id (PATCH) should update a todo', async () => {
    // please refer to todo information in `src/migrations/1750822098511-create-todo.ts`
    const id = '11111111-1111-1111-1111-111111111111';
    const updateDto = { title: 'Updated Title', description: 'Updated Desc' };
    const res = await request(app.getHttpServer())
      .patch(`/todos/${id}`)
      .send(updateDto)
      .expect(200);
    expect(res.body).toHaveProperty('title', updateDto.title);
    expect(res.body).toHaveProperty('description', updateDto.description);
  });

  it('/todos/:id (DELETE) should delete a todo', async () => {
    // please refer to todo information in `src/migrations/1750822098511-create-todo.ts`
    const id = '11111111-1111-1111-1111-11111111111f';
    await request(app.getHttpServer()).delete(`/todos/${id}`).expect(204);
  });
});

import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { createApp } from '../src/app';
import { AppModule } from '../src/app.module';
import { LoginDto } from '../src/auth/dtos/login.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createApp<App>(AppModule);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/access-tokens (POST) should login and return access token', async () => {
    // please refer to user information in `src/migrations/1750906332138-create-user.ts`
    const loginDto: LoginDto = { username: 'test@test.com', password: '12345' };
    const res = await request(app.getHttpServer())
      .post('/auth/access-tokens')
      .send(loginDto)
      .expect(201);
    const responseBody = res.body as Record<string, any>;

    expect(responseBody).toHaveProperty('accessToken');
    expect(responseBody.user).toMatchObject({
      id: '11111111-1111-1111-1111-111111111111',
      email: 'test@test.com',
      username: 'testuser',
    });
    expect(res.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('accessToken=')]),
    );
  });

  it('/auth/access-tokens (POST) should return 401 for invalid credentials', async () => {
    // please refer to user information in `src/migrations/1750906332138-create-user.ts`
    const loginDto: LoginDto = { username: 'wrong@test.com', password: 'wrong' };
    const res = await request(app.getHttpServer())
      .post('/auth/access-tokens')
      .send(loginDto)
      .expect(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});

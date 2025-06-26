import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AuthController } from '../src/auth/controllers/auth.controller';
import { LoginDto } from '../src/auth/dtos/login.dto';
import { User } from '../src/auth/entities/user.entity';
import { AuthService } from '../src/auth/services/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let mockAuthService: MockProxy<AuthService>;

  beforeAll(async () => {
    mockAuthService = mock<AuthService>();

    const moduleFixture = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/access-tokens (POST) should login and return access token', async () => {
    const user: User = {
      id: '1',
      email: 'test@test.com',
      username: 'testuser',
      hashedPassword: 'hashed',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const loginDto: LoginDto = { username: 'test@test.com', password: '12345' };
    const accessToken = 'jwt-token';
    mockAuthService.login.mockResolvedValue({
      accessToken,
      user: { id: user.id, email: user.email, username: user.username },
    });

    const res = await request(app.getHttpServer())
      .post('/auth/access-tokens')
      .send(loginDto)
      .expect(201);
    const responseBody = res.body as Record<string, any>;

    expect(responseBody).toHaveProperty('accessToken');
    expect(responseBody.user).toMatchObject({
      id: user.id,
      email: user.email,
      username: user.username,
    });
    expect(res.headers['set-cookie']).toEqual(
      expect.arrayContaining([
        expect.stringContaining(`accessToken=${accessToken}`),
      ]),
    );
  });

  it('/auth/access-tokens (POST) should return 401 for invalid credentials', async () => {
    const loginDto: LoginDto = { username: 'wrong@test.com', password: 'wrong' };
    mockAuthService.login.mockImplementation(() => {
      throw new UnauthorizedException('Invalid credentials');
    });

    const res = await request(app.getHttpServer())
      .post('/auth/access-tokens')
      .send(loginDto)
      .expect(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});

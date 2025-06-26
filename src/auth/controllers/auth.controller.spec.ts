import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { mock, MockProxy } from 'jest-mock-extended';
import { LoginDto } from '../dtos/login.dto';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: MockProxy<AuthService>;

  beforeEach(async () => {
    authService = mock<AuthService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login and return access token and user info', async () => {
      const dto: LoginDto = { username: 'test@test.com', password: '12345' };
      const authResult = {
        accessToken: 'token',
        user: { id: '1', email: 'test@test.com', username: 'testuser' },
      };
      authService.login.mockResolvedValue(authResult);
      const res = mock<Response>();
      await expect(controller.login(dto, res)).resolves.toEqual(authResult);
      expect(authService.login).toHaveBeenCalledWith(dto.username, dto.password);
      expect(res.cookie).toHaveBeenCalledWith(
        'accessToken',
        authResult.accessToken,
        { httpOnly: true },
      );
    });
  });
});

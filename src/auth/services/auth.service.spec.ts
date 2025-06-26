import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { mock, MockProxy } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: MockProxy<Repository<User>>;
  let jwtService: MockProxy<JwtService>;

  beforeEach(async () => {
    userRepository = mock<Repository<User>>();
    jwtService = mock<JwtService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should throw if user not found', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      await expect(service.validateUser('test@test.com', '12345')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if password is invalid', async () => {
      userRepository.findOne.mockResolvedValue({
        email: 'test@test.com',
        hashedPassword: 'hashed',
      } as User);
      (compare as jest.Mock).mockResolvedValue(false);
      await expect(service.validateUser('test@test.com', 'wrong')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return user if credentials are valid', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        hashedPassword: 'hashed',
        username: 'testuser',
      } as User;
      userRepository.findOne.mockResolvedValue(user);
      (compare as jest.Mock).mockResolvedValue(true);
      await expect(service.validateUser('test@test.com', '12345')).resolves.toEqual(
        user,
      );
    });
  });

  describe('login', () => {
    it('should return accessToken and user info', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        hashedPassword: 'hashed',
        username: 'testuser',
      } as User;
      userRepository.findOne.mockResolvedValue(user);
      jwtService.sign.mockReturnValue('token');

      await expect(service.login('test@test.com', '12345')).resolves.toEqual({
        accessToken: 'token',
        user: { id: '1', email: 'test@test.com', username: 'testuser' },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      });
    });
  });
});

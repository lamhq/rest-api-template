import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginDto } from '../dtos/login.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('access-tokens')
  @ApiOperation({ summary: 'Login and get access token' })
  @ApiBody({ description: 'Login credentials', type: LoginDto })
  @ApiResponse({ status: 201, description: 'Access token and user info returned' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authResult = await this.authService.login(
      loginDto.username,
      loginDto.password,
    );
    res.cookie('accessToken', authResult.accessToken, { httpOnly: true });
    return authResult;
  }
}

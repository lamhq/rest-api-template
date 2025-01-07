import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

/**
 * A basic CRUD API app
 */
@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
})
export class CrudModule {}

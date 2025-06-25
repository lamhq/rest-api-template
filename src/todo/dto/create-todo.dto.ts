import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TodoStatus } from '../entities/todo.entity';

export class CreateTodoDto {
  @ApiProperty({ description: 'Title of the todo item' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Description of the todo item' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TodoStatus, description: 'Status of the todo item' })
  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;
}

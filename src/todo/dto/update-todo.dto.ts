import { PartialType } from '@nestjs/mapped-types';
import { ApiExtraModels } from '@nestjs/swagger';
import { CreateTodoDto } from './create-todo.dto';

/**
 * DTO for updating a todo item. All fields are optional and inherited from CreateTodoDto.
 *
 * @remarks
 * This DTO is used for the update endpoint. It extends CreateTodoDto with all properties optional.
 */
@ApiExtraModels()
export class UpdateTodoDto extends PartialType(CreateTodoDto) {}

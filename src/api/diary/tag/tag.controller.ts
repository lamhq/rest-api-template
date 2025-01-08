import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';

@Controller('diary/tags')
@ApiTags('Diary')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiOkResponse({
    description: 'Tag list',
    type: String,
    isArray: true,
  })
  async findAll(): Promise<string[]> {
    const tags = await this.tagService.findAll();
    return tags.map((tag) => tag.name);
  }
}

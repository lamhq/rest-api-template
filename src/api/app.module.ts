import { Module } from '@nestjs/common';
import { DiaryModule } from './diary/diary.module';

@Module({
  imports: [DiaryModule],
})
export class AppModule {}

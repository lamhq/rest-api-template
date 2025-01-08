import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ActivityController } from './activity/activity.controller';
import { Activity } from './activity/activity.entity';
import { ActivityService } from './activity/activity.service';
import { configFactory } from './config';
import { StatController } from './stat/stat.controller';
import { StatService } from './stat/stat.service';
import { TagController } from './tag/tag.controller';
import { Tag } from './tag/tag.entity';
import { TagService } from './tag/tag.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // allow injecting ConfigService in module factory
      load: [configFactory],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const typeormConfig = configService.get<TypeOrmModuleOptions>('typeorm');
        if (!typeormConfig) {
          throw new Error(
            'Invalid system configuration. TypeORM config is not set.',
          );
        }
        return typeormConfig;
      },
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    TypeOrmModule.forFeature([Activity, Tag]),
  ],
  controllers: [ActivityController, TagController, StatController],
  providers: [ActivityService, TagService, StatService],
})
export class DiaryModule {}

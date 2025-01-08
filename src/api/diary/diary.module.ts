import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ActivityController } from './activity/activity.controller';
import { Activity } from './activity/activity.entity';
import { ActivityService } from './activity/activity.service';
import { configFactory } from './config';
import { TagController } from './tag/tag.controller';
import { StatController } from './stat/stat.controller';
import { TagService } from './tag/tag.service';
import { Tag } from './tag/tag.entity';
import { StatService } from './stat/stat.service';

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

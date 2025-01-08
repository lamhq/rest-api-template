import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import {
  ACTIVITY_CREATED_EVENT,
  ACTIVITY_UPDATED_EVENT,
  ActivityCreatedEvent,
  ActivityUpdatedEvent,
} from '../activity/activity.event';
import { Tag } from './tag.entity';

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private tagRepo: MongoRepository<Tag>) {}

  @OnEvent(ACTIVITY_CREATED_EVENT)
  async handleActivityCreated(event: ActivityCreatedEvent): Promise<void> {
    await Promise.all(event.activity.tags.map((tag) => this.createOrUpdate(tag)));
  }

  @OnEvent(ACTIVITY_UPDATED_EVENT)
  async handleActivityUpdated(event: ActivityUpdatedEvent): Promise<void> {
    await Promise.all(event.after.tags.map((tag) => this.createOrUpdate(tag)));
  }

  async findAll(): Promise<Tag[]> {
    return this.tagRepo.find({
      order: { name: 'ASC' },
    });
  }

  async createOrUpdate(tag: string) {
    return this.tagRepo.updateOne(
      { name: tag },
      { $set: { name: tag } },
      { upsert: true },
    );
  }
}

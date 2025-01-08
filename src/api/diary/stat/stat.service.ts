import { Injectable } from '@nestjs/common';
import { DataSource, ObjectLiteral } from 'typeorm';
import { Activity, ActivityQuery } from '../activity/activity.entity';
import { Revenue } from './revenue.entity';

@Injectable()
export class StatService {
  constructor(private dataSource: DataSource) {}

  async calcRevenue(query: ActivityQuery): Promise<Revenue> {
    const pipes: ObjectLiteral[] = [];
    const match: ObjectLiteral = {};

    if (query.text) {
      match.$text = { $search: query.text };
    }

    if (query.tags) {
      match.tags = { $elemMatch: { $in: query.tags } };
    }

    if (query.from || query.to) {
      const conditions: ObjectLiteral = {};
      if (query.from) {
        conditions.$gt = query.from;
      }
      if (query.to) {
        conditions.$lt = query.to;
      }
      match.time = conditions;
    }

    if (Object.keys(match).length > 0) {
      pipes.push({ $match: match });
    }

    pipes.push({
      $group: {
        _id: 'all',
        income: { $sum: '$income' },
        outcome: { $sum: '$outcome' },
      },
    });
    const aggData = await this.dataSource.mongoManager
      .aggregate<Activity, Revenue>(Activity, pipes)
      .toArray();
    // const aggData = await this.activityRepo.aggregate<Revenue>(pipes).toArray();
    return aggData.length ? aggData[0] : { income: 0, outcome: 0 };
  }
}

import { ObjectId } from 'mongodb';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Activity } from '../activity/activity.entity';
import { Tag } from '../tag/tag.entity';

export default class ActivitySeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const activityFactory = factoryManager.get(Activity);

    // save activities
    const activity = await activityFactory.save(
      new Activity({
        id: new ObjectId('673ec4733049d5c9042506a9'),
        content: 'Sophismata cras dolor viriliter aut.',
        time: new Date('2023-11-23T10:00:00.441Z'),
        tags: ['suet', 'dude', 'pantry', 'gator'],
        income: 424,
        outcome: 713,
      }),
    );
    const activities = [activity, ...(await activityFactory.saveMany(199))];

    // save tags
    const allTags = activities.reduce<string[]>(
      (previousValue, currentValue) => [...previousValue, ...currentValue.tags],
      [],
    );
    const tags = [...new Set(allTags)];
    await Promise.all(
      tags.map((tag) =>
        dataSource.getMongoRepository(Tag).save(new Tag({ name: tag })),
      ),
    );

    // create index on `activities` collection
    await dataSource.mongoManager.createCollectionIndex(Activity, {
      content: 'text',
      tags: 'text',
    });
  }
}

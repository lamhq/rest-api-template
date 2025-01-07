import { setSeederFactory } from 'typeorm-extension';
import { Activity } from '../activity/activity.entity';

export default setSeederFactory(Activity, (faker) => {
  const activity = new Activity({
    content: faker.lorem.sentence(5),
    income: faker.number.int(1000),
    outcome: faker.number.int(1000),
    time: faker.date.past(),
    tags: [
      ...new Set(
        new Array(faker.number.int(5))
          .fill(null)
          .map(() => faker.word.noun().toLowerCase()),
      ),
    ],
  });
  return activity;
});

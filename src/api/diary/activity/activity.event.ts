import { Activity } from './activity.entity';

export const ACTIVITY_REMOVED_EVENT = 'activity.removed';

export const ACTIVITY_CREATED_EVENT = 'activity.created';

export const ACTIVITY_UPDATED_EVENT = 'activity.updated';

export class ActivityCreatedEvent {
  activity: Activity;

  constructor(partial: Partial<ActivityCreatedEvent>) {
    Object.assign(this, partial);
  }
}

export class ActivityUpdatedEvent {
  before: Activity;

  after: Activity;

  constructor(partial: Partial<ActivityUpdatedEvent>) {
    Object.assign(this, partial);
  }
}

export class ActivityRemovedEvent {
  activity: Activity;

  constructor(partial: Partial<ActivityRemovedEvent>) {
    Object.assign(this, partial);
  }
}

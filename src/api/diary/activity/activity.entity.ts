import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { PaginationQuery } from '../../common/types';

/**
 * The activity to be recorded
 */
@Entity({ name: 'activities' })
export class Activity {
  @ObjectIdColumn()
  @Transform((data) => (data.value as ObjectId).toString())
  @Expose()
  id: ObjectId;

  @Expose()
  @Column()
  content?: string;

  /**
   * When the activity happen
   */
  @Expose()
  @Column()
  time: Date;

  @Expose()
  @Column()
  tags: string[] = [];

  /**
   * Amount of money get from the activity (k)
   */
  @Expose()
  @Column()
  income?: number;

  /**
   * Amount of money spent on the activity (k)
   */
  @Expose()
  @Column()
  outcome?: number;

  constructor(data: Partial<Activity>) {
    Object.assign(this, data);
  }
}

export interface ActivityQuery extends PaginationQuery {
  text?: string;
  tags?: string[];
  from?: Date;
  to?: Date;
}

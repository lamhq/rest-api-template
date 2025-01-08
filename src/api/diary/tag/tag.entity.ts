import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'tags' })
export class Tag {
  @ObjectIdColumn()
  @Transform((data) => (data.value as ObjectId).toString())
  @Expose()
  id: ObjectId;

  @Expose()
  @Column()
  name: string;

  constructor(partial: Partial<Tag>) {
    Object.assign(this, partial);
  }
}

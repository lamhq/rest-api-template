import { Expose, Transform } from 'class-transformer';
import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

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

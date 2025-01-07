import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private users: User[] = [];

  findAll(): Promise<User[]> {
    return Promise.resolve(this.users);
  }

  findOne(id: number): Promise<User> {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id.toString()} not found`);
    }
    return Promise.resolve(user);
  }

  create(user: User): Promise<User> {
    user.id = this.users.length > 0 ? this.users[this.users.length - 1].id + 1 : 1;
    this.users.push(user);
    return Promise.resolve(user);
  }

  remove(id: number): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with ID ${id.toString()} not found`);
    }
    this.users.splice(index, 1);
    return Promise.resolve();
  }
}

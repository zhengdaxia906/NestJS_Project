import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    // ...
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: User): Promise<User> {
    const newUser = this.userRepository.create(user);

    return await this.userRepository.save(newUser);
  }

  update(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  findUserProfile(userId: number) {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });
  }

  findUserLogs(userId: number) {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['logs'],
    });
  }
}

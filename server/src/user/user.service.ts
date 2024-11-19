import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    try {
      const users = await this.userRepository.find();
      return users;
    } catch (error) {
      console.log(error);
    }
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException('NO user found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
      // password: hashedPassword,
    });
    if (!user) {
      throw new NotFoundException('No user found');
    }
    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    const isDeleted = await this.userRepository.delete(id);
    if (!isDeleted) {
      throw new BadRequestException(
        'Unable to delete the user or invalid user id',
      );
    }
    return isDeleted;
  }
}

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginUSerDto } from 'src/user/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userExist = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (userExist) {
      throw new ConflictException('User Already exist');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    console.log(process.env.MANAGER_PASSKEY);
    const isManager:boolean = process.env.MANAGER_PASSKEY === createUserDto.password;
    const user = this.userRepository.create({
      ...createUserDto,
      isManager: isManager,
      password: hashedPassword,
    });

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Unable to add user');
    }
  }

  async validateUser(userCredentials: LoginUSerDto) {
    const user = await this.userRepository.findOne({
      where: { email: userCredentials.email },
    });
    if (!user) throw new NotFoundException('User not found!');

    const isPasswordValid = await this.comparePasswords(
      userCredentials.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const currentUser: { id: number; isManager:boolean } = {
      id: user.id,
      isManager:user.isManager
    };
    return this.jwtService.sign(currentUser);
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

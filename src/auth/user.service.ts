import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();

    Object.assign(user, createUserDto);
    user.password = await this.authService.hashPassword(user.password);

    return this.userRepository.save(user);
  }
}

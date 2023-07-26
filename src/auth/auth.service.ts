import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public getTokenForUser(user: User): string {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }

  public hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      this.logger.debug(`User ${username} not found`);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.debug(`Password mismatch for user ${username}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}

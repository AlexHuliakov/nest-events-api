import { ClassSerializerInterceptor, Controller, Get, Logger, Post, SerializeOptions, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuardJwt } from './guards/auth-guard.jwt';
import { AuthGuardLocal } from './guards/auth-guard.local';
import { CurrentUser } from './user.decorator';
import { User } from './user.entity';

@Controller('auth')
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: User) {
    this.logger.debug(`User ${user.username} logged in with local strategy`);

    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user),
    };
  }

  @Get('profile')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  getProfile(@CurrentUser() user: User) {
    return user;
  }
}

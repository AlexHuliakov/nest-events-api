import { User } from './user.entity';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { AuthResolver } from './auth.resolver';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { UsersController } from './users.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserDoesNotExistConstraint } from './validation/user-not-exists.constraint';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [
    LocalStrategy,
    AuthService,
    JwtStrategy,
    AuthResolver,
    UserResolver,
    UserService,
    UserDoesNotExistConstraint
  ],
  controllers: [AuthController, UsersController],
})
export class AuthModule {}

import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { AuthGuardJwtGql } from './guards/auth-guard-jwt.gql';
import { CurrentUser } from './user.decorator';
import { User } from './user.entity';

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  @UseGuards(AuthGuardJwtGql)
  public me(@CurrentUser() user: User): User {
    return user;
  }
}

import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserDto } from './dto/create.user.dto';
import { AuthGuardJwtGql } from './guards/auth-guard-jwt.gql';
import { CurrentUser } from './user.decorator';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {
  }
  
  @Query(() => User, { nullable: true })
  @UseGuards(AuthGuardJwtGql)
  public me(@CurrentUser() user: User): User {
    return user;
  }
  
  @Mutation(() => User, { name: 'userAdd' })
  public add(@Args('input') input: CreateUserDto): Promise<User> {
    return this.userService.create(input);
  }
}

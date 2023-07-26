import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, Length } from 'class-validator';
import { IsRepeated } from '../../validation/is-repeated-constrain';
import { UserDoesNotExist } from '../validation/user-not-exists.constraint';

@InputType('UserAddInput')
export class CreateUserDto {
  @Length(5)
  @UserDoesNotExist()
  @Field()
  username: string;
  @Length(5)
  @Field()
  password: string;
  @IsRepeated('password')
  @Field()
  passwordConfirm: string;
  @IsEmail()
  @UserDoesNotExist()
  @Field()
  email: string;
  @Length(2)
  @Field()
  firstName: string;
  @Length(2)
  @Field()
  lastName: string;
}

import { IsEmail, Length } from 'class-validator';
import { IsRepeated } from '../../validation/is-repeated-constrain';
import { UserDoesNotExist } from '../validation/user-not-exists.constraint';

export class CreateUserDto {
  @Length(5)
  @UserDoesNotExist()
  username: string;
  @Length(5)
  password: string;
  @IsRepeated('password')
  passwordConfirm: string;
  @IsEmail()
  @UserDoesNotExist()
  email: string;
  @Length(2)
  firstName: string;
  @Length(2)
  lastName: string;
}

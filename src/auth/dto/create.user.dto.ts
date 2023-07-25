import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @Length(5)
  username: string;
  @Length(5)
  password: string;
  @Length(5)
  passwordConfirm: string;
  @IsEmail()
  email: string;
  @Length(2)
  firstName: string;
  @Length(2)
  lastName: string;
}

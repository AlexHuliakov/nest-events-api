import { IsDateString, IsString, Length } from 'class-validator';

export class CreateEventDto {
  @Length(5, 255, { message: 'Name must be at least 5 characters long' })
  name: string;

  @Length(10, 255)
  description: string;

  @IsDateString()
  when: string;

  @IsString()
  address: string;
}

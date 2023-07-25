import { IsEnum } from 'class-validator';
import { AttendeeAnswer } from '../entities/attendee.entity';

export class CreateAttendeeDto {
  @IsEnum(AttendeeAnswer)
  answer: AttendeeAnswer;
}

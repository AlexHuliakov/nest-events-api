import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { Attendee } from './entities/attendee.entity';

@Injectable()
export class AttendeesService {
  constructor(
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
  ) {}

  public findByEventId(eventId: number): Promise<Attendee[]> {
    return this.attendeeRepository.find({
      where: {
        event: {
          id: eventId,
        },
      },
    });
  }

  public findOneByEventIdAndUserId(
    eventId: number,
    userId: number,
  ): Promise<Attendee | undefined> {
    return this.attendeeRepository.findOne({
      where: {
        event: {
          id: eventId,
        },
        user: { id: userId },
      },
    });
  }

  public async createOrUpdate(
    input: CreateAttendeeDto,
    eventId: number,
    userId: number,
  ): Promise<Attendee> {
    const attendee =
      (await this.findOneByEventIdAndUserId(eventId, userId)) ?? new Attendee();
    attendee.answer = input.answer;
    attendee.eventId = eventId;
    attendee.userId = userId;

    return this.attendeeRepository.save(attendee);
  }
}

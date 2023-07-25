import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendee } from './entities/attendee.entity';

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
}

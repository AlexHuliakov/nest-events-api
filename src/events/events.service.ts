import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateOptions } from 'src/pagination/paginator';
import { DeleteResult, Repository } from 'typeorm';
import { ListEvents, WhenEventFilter } from './dto/list.events';
import { AttendeeAnswer } from './entities/attendee.entity';
import { Event } from './entities/event.entity';

export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  private getEventsBaseQuery() {
    return this.eventRepository
      .createQueryBuilder('event')
      .orderBy('event.id', 'DESC');
  }

  public getEvent(id: number): Promise<Event | undefined> {
    const query = this.getEventsWithAttendeeCount().andWhere('event.id = :id', {
      id,
    });
    this.logger.debug(query.getSql());
    return query.getOne();
  }

  public getEventsWithAttendeeCount() {
    return this.getEventsBaseQuery()
      .loadRelationCountAndMap('event.attendeeCount', 'event.attendees')
      .loadRelationCountAndMap(
        'event.attendeeAcceptedCount',
        'event.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswer.Accepted,
          }),
      )
      .loadRelationCountAndMap(
        'event.attendeeMaybeCount',
        'event.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswer.Maybe,
          }),
      )
      .loadRelationCountAndMap(
        'event.attendeeRejectedCount',
        'event.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswer.Rejected,
          }),
      );
  }

  private getEventsWithAttendeeCountFiltered(filter?: ListEvents) {
    let query = this.getEventsWithAttendeeCount();

    if (filter?.when) {
      if (filter.when == WhenEventFilter.Today) {
        query = query.andWhere(`event.when >= :start AND event.when <= :end`, {
          start: new Date(),
          end: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        });
      } else if (filter.when == WhenEventFilter.Tomorrow) {
        query = query.andWhere(`event.when >= :start AND event.when <= :end`, {
          start: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
          end: new Date(new Date().getTime() + 24 * 2 * 60 * 60 * 1000),
        });
      } else if (filter.when == WhenEventFilter.ThisWeek) {
        query = query.andWhere(`event.when >= :start AND event.when <= :end`, {
          start: new Date(),
          end: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        });
      } else if (filter.when == WhenEventFilter.NextWeek) {
        query = query.andWhere(`event.when >= :start AND event.when <= :end`, {
          start: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
          end: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000),
        });
      }
    }

    return query;
  }

  public async getEventsWithAttendeeCountFilteredPaginated(
    filter: ListEvents,
    paginateOptions: PaginateOptions,
  ) {
    return await paginate(
      this.getEventsWithAttendeeCountFiltered(filter),
      paginateOptions,
    );
  }

  public async deleteEvent(id: number): Promise<DeleteResult> {
    return await this.eventRepository
      .createQueryBuilder('event')
      .delete()
      .where('event.id = :id', { id })
      .execute();
  }
}

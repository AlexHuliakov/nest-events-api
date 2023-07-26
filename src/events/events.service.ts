import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { paginate, PaginateOptions } from '../pagination/paginator';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { ListEvents, WhenEventFilter } from './dto/list.events';
import { UpdateEventDto } from './dto/update-event.dto';
import { AttendeeAnswer } from './entities/attendee.entity';
import { Event, PaginatedEvents } from './entities/event.entity';

export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  private getEventsBaseQuery(): SelectQueryBuilder<Event> {
    return this.eventRepository
      .createQueryBuilder('event')
      .orderBy('event.id', 'DESC');
  }

  public findOne(id: number): Promise<Event | undefined> {
    return this.getEventsBaseQuery()
      .andWhere('event.id = :id', { id })
      .getOne();
  }

  public getEventWithAttendeeCount(id: number): Promise<Event | undefined> {
    const query = this.getEventsWithAttendeeCountQuery().andWhere(
      'event.id = :id',
      {
        id,
      },
    );
    this.logger.debug(query.getSql());
    return query.getOne();
  }

  public getEventsWithAttendeeCountQuery(): SelectQueryBuilder<Event> {
    return this.getEventsBaseQuery()
      .leftJoinAndSelect('event.organizer', 'organizer')
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

  private getEventsWithAttendeeCountFilteredQuery(
    filter?: ListEvents,
  ): SelectQueryBuilder<Event> {
    let query = this.getEventsWithAttendeeCountQuery();

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
  ): Promise<PaginatedEvents> {
    return await paginate(
      this.getEventsWithAttendeeCountFilteredQuery(filter),
      PaginatedEvents,
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

  public async createEvent(event: CreateEventDto, user: User): Promise<Event> {
    return this.eventRepository.save(
      new Event({
        ...event,
        organizer: user,
        when: new Date(event.when),
      }),
    );
  }

  public async updateEvent(input: UpdateEventDto, user: User): Promise<Event> {
    return this.eventRepository.save(
      new Event({
        ...input,
        organizer: user,
        when: new Date(input.when),
      }),
    );
  }

  public getEventsOrganizedByUserIdPaginated(
    userId: number,
    paginateOptions: PaginateOptions,
  ): Promise<PaginatedEvents> {
    return paginate<Event, PaginatedEvents>(
      this.getEventsOrganizedByUserIdQuery(userId),
      PaginatedEvents,
      paginateOptions,
    );
  }

  private getEventsOrganizedByUserIdQuery(
    userId: number,
  ): SelectQueryBuilder<Event> {
    return this.getEventsBaseQuery().where('event.organizerId = :userId', {
      userId,
    });
  }

  public getEventsAttendedByUserIdPaginated(
    userId: number,
    paginateOptions: PaginateOptions,
  ): Promise<PaginatedEvents> {
    return paginate<Event, PaginatedEvents>(
      this.getEventsAttendedByUserIdQuery(userId),
      PaginatedEvents,
      paginateOptions,
    );
  }

  private getEventsAttendedByUserIdQuery(
    userId: number,
  ): SelectQueryBuilder<Event> {
    return this.getEventsBaseQuery()
      .leftJoinAndSelect('event.attendees', 'attendee')
      .where('attendee.userId = :userId', {
        userId,
      });
  }
}

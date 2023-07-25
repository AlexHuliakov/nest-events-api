import { User } from '../../auth/user.entity';
import { Repository } from 'typeorm';
import { ListEvents } from '../dto/list.events';
import { Event } from '../entities/event.entity';
import { EventsService } from '../events.service';
import { EventsController } from './events.controller';
import { NotFoundException } from '@nestjs/common';

describe('EventsController', () => {
  let eventsService: EventsService;
  let eventsController: EventsController;
  let eventsRepository: Repository<Event>;

  beforeAll(async () => {});
  beforeEach(async () => {
    eventsService = new EventsService(eventsRepository);
    eventsController = new EventsController(eventsService);
  });

  it('should return a list of events', () => {
    eventsService.getEventsWithAttendeeCountFilteredPaginated = jest
      .fn()
      .mockImplementation(() => {
        return {
          first: 1,
          last: 1,
          limit: 10,
          data: [],
        };
      });

    const spy = jest.spyOn(
      eventsService,
      'getEventsWithAttendeeCountFilteredPaginated',
    );

    const result = eventsController.findAll(new ListEvents());
    expect(result).toEqual({
      first: 1,
      last: 1,
      limit: 10,
      data: [],
    });

    expect(spy).toBeCalledTimes(1);
  });

  it('should not delete an event if not found', async () => {
    const deleteSpy = jest.spyOn(eventsService, 'deleteEvent');
    const findSpy = jest
      .spyOn(eventsService, 'findOne')
      .mockImplementation(() => undefined);

    try {
      await eventsController.remove(1, new User());
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }

    expect(deleteSpy).toBeCalledTimes(0);
    expect(findSpy).toBeCalledTimes(1);
  });
});

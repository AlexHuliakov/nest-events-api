import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { EventsService } from '../events.service';
import { Test } from '@nestjs/testing';
import { UpdateEventDto } from '../dto/update-event.dto';
import { User } from '../../auth/user.entity';

describe('EventsService', () => {
  let service: EventsService;
  let repository: Repository<Event>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
            delete: jest.fn(),
            where: jest.fn(),
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  describe('updateEvent', () => {
    it('should update the event', async () => {
      const repoSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ id: 1 } as Event);
      expect(
        service.updateEvent(new UpdateEventDto({ id: 1, name: 'New name' }), new User()),
      ).resolves.toEqual({ id: 1 });
    });
  });
});

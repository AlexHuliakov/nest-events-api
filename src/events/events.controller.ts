import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { ListEvents } from './dto/list.events';

@Controller('events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    private readonly eventsService: EventsService,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() filter: ListEvents) {
    return this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
      filter,
      {
        total: true,
        currentPage: filter.page,
        limit: 10,
      },
    );
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id) {
    const event = await this.eventsService.getEvent(id);

    if (!event) {
      throw new NotFoundException(`No event found with id ${id}`);
    }

    return event;
  }

  @Post()
  create(@Body() input: CreateEventDto) {
    return (
      this,
      this.eventsRepository.save({
        ...input,
        when: new Date(input.when),
      })
    );
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id,
    @Body() input: UpdateEventDto,
  ) {
    const event = await this.findOne(id);

    return this.eventsRepository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseIntPipe()) id) {
    const { affected } = await this.eventsRepository.delete(id);

    if (affected === 0) {
      throw new NotFoundException(`No event found with id ${id}`);
    }

    return null;
  }
}

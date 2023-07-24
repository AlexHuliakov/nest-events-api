import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);
  
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  @Get()
  findAll() {
    this.logger.log('Find all events');
    return this.eventsRepository.find();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id) {
    return this.eventsRepository.findOne({
      where: {
        id,
      },
    });
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
  remove(@Param('id', new ParseIntPipe()) id) {
    return this.eventsRepository.delete(id);
  }
}

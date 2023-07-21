import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { Event } from './event.entity';

@Controller('events')
export class EventsController {
  private events: Event[] = [];
  @Get()
  findAll() {
    return this.events;
  }

  @Get(':id')
  findOne(@Param('id') id) {
    return this.events.find((event) => event.id === parseInt(id));
  }

  @Post()
  create(@Body() input: CreateEventDto) {
    const event = {
      ...input,
      when: new Date(input.when),
      id: this.events.length + 1,
    };

    this.events.push(event);
    return event;
  }

  @Patch(':id')
  update(@Param('id') id, @Body() input: UpdateEventDto) {
    const index = this.events.findIndex((event) => event.id === parseInt(id));
    const event = this.events[index];

    const newEvent = {
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    };

    this.events[index] = newEvent;
    return newEvent;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id) {
    this.events = this.events.filter((event) => event.id !== parseInt(id));
  }
}

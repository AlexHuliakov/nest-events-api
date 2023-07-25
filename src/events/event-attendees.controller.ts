import {
  Get,
  Param,
  Controller,
  UseInterceptors,
  SerializeOptions,
  ClassSerializerInterceptor,
  ParseIntPipe,
} from '@nestjs/common';
import { AttendeesService } from './attendees.service';

@Controller('events/:eventId/attendees')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventAttendeesController {
  constructor(private readonly attendeeService: AttendeesService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.attendeeService.findByEventId(eventId);
  }
}

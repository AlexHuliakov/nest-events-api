import { ClassSerializerInterceptor, Controller, Get, Param, SerializeOptions, UseInterceptors } from '@nestjs/common';
import { AttendeesService } from './attendees.service';

@Controller('events/:eventId/attendees')\
@SerializeOptions({ strategy: 'excludeAll' })
export class EventAttendeesController {
  constructor(private readonly attendeeService: AttendeesService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@Param('eventId') eventId: number) {
    return this.attendeeService.findByEventId(eventId);
  }
}

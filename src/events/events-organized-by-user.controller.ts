import {
  Get,
  Param,
  Query,
  Controller,
  ParseIntPipe,
  UseInterceptors,
  DefaultValuePipe,
  SerializeOptions,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events-organized-by-user/:userId')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsOrganizedByUserController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
  ) {
    return this.eventsService.getEventsOrganizedByUserIdPaginated(userId, {
      currentPage: page,
      limit: 5,
    });
  }
}

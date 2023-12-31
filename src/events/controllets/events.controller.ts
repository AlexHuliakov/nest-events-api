import {
  Get,
  Body,
  Post,
  Param,
  Patch,
  Query,
  Delete,
  Logger,
  HttpCode,
  UsePipes,
  UseGuards,
  Controller,
  ParseIntPipe,
  ValidationPipe,
  UseInterceptors,
  SerializeOptions,
  NotFoundException,
  ForbiddenException,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { User } from '../../auth/user.entity';
import { ListEvents } from '../dto/list.events';
import { EventsService } from '../events.service';
import { CurrentUser } from '../../auth/user.decorator';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { AuthGuardJwt } from '../../auth/guards/auth-guard.jwt';
import { Event } from '../entities/event.entity';

@Controller('events')
@SerializeOptions({
  strategy: 'excludeAll',
})
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
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
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) id) {
    const event = await this.eventsService.getEventWithAttendeeCount(id);

    if (!event) {
      throw new NotFoundException(`No event found with id ${id}`);
    }

    return event;
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() input: CreateEventDto, @CurrentUser() user: User) {
    return this.eventsService.createEvent(input, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) id,
    @Body() input: UpdateEventDto,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventsService.findOne(id);

    if (event.organizer.id !== user.id) {
      throw new ForbiddenException();
    }

    return this.eventsService.updateEvent(input, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id, @CurrentUser() user: User) {
    const event = await this.eventsService.findOne(id);
    if (!event) {
      throw new NotFoundException(`No event found with id ${id}`);
    }

    if (event?.organizer?.id !== user.id) {
      throw new ForbiddenException();
    }

    await this.eventsService.deleteEvent(id);

    return null;
  }
}

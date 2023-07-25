import {
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Controller,
  ParseIntPipe,
  UseInterceptors,
  DefaultValuePipe,
  SerializeOptions,
  NotFoundException,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EventsService } from './events.service';
import { CurrentUser } from 'src/auth/user.decorator';
import { AttendeesService } from './attendees.service';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';
import { CreateAttendeeDto } from './dto/create-attendee.dto';

@Controller('current-user-event-attendance')
@SerializeOptions({ strategy: 'excludeAll' })
export class CurrentUserEventAttendanceController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly attendeesService: AttendeesService,
  ) {}
  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
  ) {
    return this.eventsService.getEventsAttendedByUserIdPaginated(user.id, {
      currentPage: page,
      limit: 5,
    });
  }

  @Get(':eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
  ) {
    const attendee = await this.attendeesService.findOneByEventIdAndUserId(
      eventId,
      user.id,
    );

    if (!attendee) {
      throw new NotFoundException();
    }

    return attendee;
  }

  @Put(':eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  createOrUpdate(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() input: CreateAttendeeDto,
    @CurrentUser() user: User,
  ) {
    return this.attendeesService.createOrUpdate(input, eventId, user.id);
  }
}

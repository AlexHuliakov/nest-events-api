import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventsService } from './events.service';
import { Attendee } from './entities/attendee.entity';
import { AttendeesService } from './attendees.service';
import { EventsController } from './events.controller';
import { EventAttendeesController } from './event-attendees.controller';
import { EventsOrganizedByUserController } from './events-organized-by-user.controller';
import { CurrentUserEventAttendanceController } from './current-user-event-attendance.controller';

@Module({
  controllers: [
    EventsController,
    EventAttendeesController,
    EventsOrganizedByUserController,
    CurrentUserEventAttendanceController,
  ],
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  providers: [EventsService, AttendeesService],
})
export class EventsModule {}

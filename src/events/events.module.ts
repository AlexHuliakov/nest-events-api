import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventsService } from './events.service';
import { Attendee } from './entities/attendee.entity';
import { AttendeesService } from './attendees.service';
import { EventsController } from './controllets/events.controller';
import { EventAttendeesController } from './controllets/event-attendees.controller';
import { EventsOrganizedByUserController } from './controllets/events-organized-by-user.controller';
import { CurrentUserEventAttendanceController } from './controllets/current-user-event-attendance.controller';

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

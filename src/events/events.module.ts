import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventsController } from './events.controller';

@Module({
controllers: [EventsController],
imports: [ TypeOrmModule.forFeature([Event])]
})
export class EventsModule {}

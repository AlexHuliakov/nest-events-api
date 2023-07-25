import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';

export enum AttendeeAnswer {
  Accepted = 1,
  Maybe = 2,
  Rejected = 3,
}

@Entity('attendee')
export class Attendee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Event, (event) => event.attendees, {
    nullable: false,
  })
  event: Event;

  @Column('enum', { enum: AttendeeAnswer, default: AttendeeAnswer.Accepted })
  answer: AttendeeAnswer;
}

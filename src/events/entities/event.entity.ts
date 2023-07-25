import { Expose } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { PaginateResult } from 'src/pagination/paginator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attendee } from './attendee.entity';

@Entity('event')
export class Event {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  description: string;

  @Column()
  @Expose()
  when: Date;

  @Column()
  @Expose()
  address: string;

  @OneToMany(() => Attendee, (attendee) => attendee.event)
  @Expose()
  attendees: Attendee[];

  @ManyToOne(() => User, (user) => user.organized)
  @JoinColumn({ name: 'organizerId' })
  @Expose()
  organizer: User;

  organizerId: number;

  attendeeCount?: number;
  attendeeRejected?: number;
  attendeeMaybe?: number;
  attendeeAccepted?: number;
}

export type PaginatedEvents = PaginateResult<Event>;

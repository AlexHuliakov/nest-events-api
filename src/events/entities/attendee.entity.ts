import { Expose } from 'class-transformer';
import { User } from 'src/auth/user.entity';
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
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @ManyToOne(() => Event, (event) => event.attendees, {
    nullable: false,
  })
  event: Event;

  @Column()
  eventId: number;
  
  @Column('enum', { enum: AttendeeAnswer, default: AttendeeAnswer.Accepted })
  @Expose()
  answer: AttendeeAnswer;
  
  @ManyToOne(() => User, (user) => user.attended)
  user: User;
  
  @Column()
  userId: number;
}

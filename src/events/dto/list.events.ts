import { IsOptional } from 'class-validator';

export enum WhenEventFilter {
  All = 1,
  Today,
  Tomorrow,
  ThisWeek,
  NextWeek,
}

export class ListEvents {
  @IsOptional()
  when?: WhenEventFilter = WhenEventFilter.All;

  @IsOptional()
  page = 1;
}

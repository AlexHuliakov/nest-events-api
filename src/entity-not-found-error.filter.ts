import { Catch, NotFoundException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { EntityNotFoundError } from 'typeorm';

@Catch(EntityNotFoundError)
export class EntityNotFoundErrorFilter extends BaseExceptionFilter {
  catch(exception, host) {
    return new NotFoundException('Entity not found');
  }
}

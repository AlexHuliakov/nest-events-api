import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { Connection } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { AuthService } from '../src/auth/auth.service';
import { User } from '../src/auth/user.entity';

let app: INestApplication;
let mod: TestingModule;
let connection;

const loadFixtures = async (sqlFilename) => {
  const sql = fs.readFileSync(path.join(__dirname, 'fixtures', sqlFilename));

  const queryRunner = connection.driver.createQueryRunner();

  for (const statement of sql.toString().split(';')) {
    if (statement.trim()) {
      await queryRunner.query(statement);
    }
  }
};

export const tokenForUser = (
  user: Partial<User> = {
    id: 1,
    username: 'e2e-test',
  },
): string => {
  return app.get(AuthService).getTokenForUser(user as User);
};

describe('Events (e2e)', () => {
  beforeAll(async () => {
    mod = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = mod.createNestApplication();
    await app.init();

    connection = app.get(Connection);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return an empty array of events', async () => {
    return request(app.getHttpServer())
      .get('/events')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          data: [],
          limit: 10,
          first: 1,
          last: 0,
          total: 0,
        });
      });
  });

  it('should return a single event', async () => {
    await loadFixtures('1-event-1-user.sql');

    return request(app.getHttpServer())
      .get('/events/1')
      .expect(200)
      .then((response) => {
        expect(response.body.data.length).toEqual(0);
      });
  });

  it('should throw an error when creating event with wrong input', async () => {
    await loadFixtures('1-user.sql');

    return request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .send({})
      .expect(400)
      .then((response) => {
        expect(response.body).toMatchObject({
          statusCode: 400,
          message: [
            'The name length is wrong',
            'name must be a string',
            'description must be longer than or equal to 5 characters',
            'when must be a valid ISO 8601 date string',
            'address must be longer than or equal to 5 characters',
          ],
          error: 'Bad Request',
        });
      });
  });

  it('should create an event', async () => {
    await loadFixtures('1-user.sql');
    const when = new Date().toISOString();

    return request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .send({
        name: 'E2e Event',
        description: 'A fake event from e2e tests',
        when,
        address: 'Street 123',
      })
      .expect(201)
      .then((_) => {
        return request(app.getHttpServer())
          .get('/events/1')
          .expect(200)
          .then((response) => {
            expect(response.body).toMatchObject({
              id: 1,
              name: 'E2e Event',
              description: 'A fake event from e2e tests',
              address: 'Street 123',
            });
          });
      });
  });

  it('should throw an error when changing non existing event', () => {
    return request(app.getHttpServer())
      .put('/events/100')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .send({})
      .expect(404);
  });

  it('should throw an error when changing an event of other user', async () => {
    await loadFixtures('1-event-2-users.sql');

    return request(app.getHttpServer())
      .patch('/events/1')
      .set(
        'Authorization',
        `Bearer ${tokenForUser({ id: 2, username: 'nasty' })}`,
      )
      .send({
        name: 'Updated event name',
      })
      .expect(403);
  });

  it('should update an event name', async () => {
    await loadFixtures('1-event-1-user.sql');

    return request(app.getHttpServer())
      .patch('/events/1')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .send({
        name: 'Updated event name',
      })
      .expect(200)
      .then((response) => {
        expect(response.body.name).toBe('Updated event name');
      });
  });

  it('should remove an event', async () => {
    await loadFixtures('1-event-1-user.sql');

    return request(app.getHttpServer())
      .delete('/events/1')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .expect(204)
      .then((response) => {
        return request(app.getHttpServer()).get('/events/1').expect(404);
      });
  });

  it('should throw an error when removing an event of other user', async () => {
    await loadFixtures('1-event-2-users.sql');

    return request(app.getHttpServer())
      .delete('/events/1')
      .set(
        'Authorization',
        `Bearer ${tokenForUser({ id: 2, username: 'nasty' })}`,
      )
      .expect(403);
  });

  it('should throw an error when removing non existing event', async () => {
    await loadFixtures('1-user.sql');

    return request(app.getHttpServer())
      .delete('/events/100')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .expect(404);
  });
});

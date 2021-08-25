import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as db from 'mongoose';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './../src/auth/auth.constants.ts';


const loginDto: AuthDto = {
  login: 'den2@gmail.com',
  password: '123',
};
jest.setTimeout(25000);
describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
//
  it('/auth/login (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        const accessToken = body.accessToken;
        expect(accessToken).toBeDefined();
      });
  });

  it('/auth/login (POST) - fail login', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, login: '12132' })
      .expect(401)
      .then(({ body }: request.Response) => {
        const message = body.message;
        const error = body.error;
        expect(message).toBeDefined();
        expect(message).toEqual(USER_NOT_FOUND_ERROR);
        expect(error).toBeDefined();
        expect(error).toEqual('Unauthorized');
      });
  });

  it('/auth/login (POST) - fail password', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: '12132' })
      .expect(401)
      .then(({ body }: request.Response) => {
        const message = body.message;
        const error = body.error;
        expect(message).toBeDefined();
        expect(message).toEqual(WRONG_PASSWORD_ERROR);
        expect(error).toBeDefined();
        expect(error).toEqual('Unauthorized');
      });
  });

  //
  afterAll(async () => {
    db.disconnect();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateReviewDto } from '../dist/review/dto/create-review.dto';
import * as db from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { AuthDto } from '../src/auth/dto/auth.dto';

const productId = new db.Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
  name: 'Test',
  title: 'title',
  description: 'description',
  rating: 5,
  productId,
};

const loginDto: AuthDto = {
  login: 'den2@gmail.com',
  password: '123',
};
jest.setTimeout(30000);
describe('ReviewController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    token = body.accessToken;
  });

  it('/review/create (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
      });
  });

  it('/review/create (POST) - fail', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send({ ...testDto, rating: 0 })
      .expect(400);
  });

  it('/review/byProduct/:productId (GET- success)', async () => {
    return request(app.getHttpServer())
      .get('/review/byProduct/' + productId)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(1);
      });
  });

  it('/review/byProduct/:productId (GET - fail)', async () => {
    return request(app.getHttpServer())
      .get('/review/byProduct/' + db.Types.ObjectId().toHexString())
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(0);
      });
  });

  it('/review/:id (DELETE - success)', async () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });

  it('/review/:id (DELETE - fail)', async () => {
    return request(app.getHttpServer())
      .delete('/review/' + db.Types.ObjectId().toHexString())
      .set('Authorization', 'Bearer ' + token)
      .expect(404, {
        statusCode: 404,
        message: REVIEW_NOT_FOUND,
      });
  });
  //
  afterAll(async () => {
    db.disconnect();
  });
});

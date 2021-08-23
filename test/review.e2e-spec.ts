import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateReviewDto } from '../dist/review/dto/create-review.dto';
import * as db from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';

const productId = new db.Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
  name: 'Test',
  title: 'title',
  description: 'description',
  rating: 5,
  productId,
};
jest.setTimeout(25000);
describe('ReviewController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/review/create (POST)', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
      });
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
      .expect(200);
  });

  it('/review/:id (DELETE - fail)', async () => {
    return request(app.getHttpServer())
      .delete('/review/' + db.Types.ObjectId().toHexString())
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

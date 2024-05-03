import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module'; 

describe('Cats (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], 
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'testpassword',
        role: 'admin'
      });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'testpassword',
      });

    jwtToken = response.body.data.token; 
  });

  it('/cats (POST)', () => {
    return request(app.getHttpServer())
      .post('/cats')
      .set('Authorization', `Bearer ${jwtToken}`) 
      .send({
        name: 'Test Cat2',
        age: 2,
        breed: 'Siamese',
      })
      .expect(201) 
      .then((response) => {
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
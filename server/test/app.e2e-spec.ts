import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';

import * as pactum from 'pactum';
import { AuthType } from 'src/auth/interface';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(6216);

    pactum.request.setBaseUrl('http://localhost:6216');
  });

  afterAll(() => {
    console.log('closing');
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthType = {
      email: 'test@test.com',
      password: '123',
    };

    describe('signIn', () => {
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signIn')
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .stores('userAt', 'access_token');
      });

      it('should return error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signIn')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
    });
  });
});

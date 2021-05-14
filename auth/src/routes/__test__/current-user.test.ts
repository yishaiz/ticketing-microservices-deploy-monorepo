import { currentUser } from '@ticketing-microservices/common-new';
import request from 'supertest';
import { app } from '../../app';

it('responsd with details about current user', async () => {
  const authResponse = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const cookie = authResponse.get('Set-Cookie');

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .expect(200);

  // console.log(response.body);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

  it('responds with details about current user from global', async () => {
    const cookie = await global.signin();
    // console.log({cookie})
    const response = await request(app)
      .get('/api/users/currentuser')
      .set('Cookie', cookie)
      // .expect(200);
      .expect(400);

    // console.log(response.body);

    expect(response.body.currentUser.email).toEqual('test@test.com');
  });

it('responds with null if not authenticated', async () => {
  const response = await request(app).get('/api/users/currentuser').expect(200);

  expect(response.body.currentUser).toEqual(null);
});

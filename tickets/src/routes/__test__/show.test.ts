import { Response } from 'express';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

// jest.mock('../../nats-wrapper')

it('returns a 404 if the ticket is not found', async () => {
  // const response = await request(app)
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/tickets/${id}`)
    // .get('/api/tickets/sdvsdfv434')
    .send({})
    .expect(404);
  // console.log(response.body)
});

it('returns the ticket if found', async () => {
  const title = 'concert';
  const price = 20;

  const response = await request(app)
    .post('/api/tickets/')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResposne = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send({})
    .expect(200);

  // console.log({ticketResposne})

  expect(ticketResposne.body.title).toEqual(title);
  expect(ticketResposne.body.price).toEqual(price);
});

// console.log('path', `/api/tickets/${response.body.id}`)
// console.log({response})
// console.log('body', response.body, response.body.id)
// const tickets = await request(app)
// .get(`/api/tickets`)
// .send({})
// .expect(200);
// console.log({'tickets': tickets.body  , 'a': 'b'})

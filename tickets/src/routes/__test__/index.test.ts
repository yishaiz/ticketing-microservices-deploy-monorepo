import request from 'supertest';
import { app } from '../../app';

// jest.mock('../../nats-wrapper')

const createTicket = () => {
  return request(app).post(`/api/tickets`).set('Cookie', global.signin()).send({
    title: 'dfbsdfbsfd',
    price: 20,
  });
};

it('can fetch a list of tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get(`/api/tickets`).send({}).expect(200);

  expect(response.body.length).toEqual(3);
});

// it('returns the ticket if found', async () => {
//   const title = 'concert';
//   const price = 20;

//   const response = await request(app)
//     .post('/api/tickets/')
//     .set('Cookie', global.signin())
//     .send({
//       title,
//       price,
//     })
//     .expect(201);

//   const ticketResposne = await request(app)
//     .get(`/api/tickets/${response.body.id}`)
//     .send({})
//     .expect(200);

//   // console.log({ticketResposne})

//   expect(ticketResposne.body.title).toEqual(title);
//   expect(ticketResposne.body.price).toEqual(price);
// });

// import { Ticket } from '../../models/ticket';
// import { Response } from 'express';
// import mongoose from 'mongoose';
// const response = await request(app)
// const id = new mongoose.Types.ObjectId().toHexString()

import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  return ticket;
};

it('fetches orders for an particular user', async () => {
  // create 3 tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  // create users
  const userOne = global.signin();
  const userTwo = global.signin();

  // create 1 order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // create 2 orders as User #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // Make request to get orders for User #2
  const response = await request(app).get('/api/orders').set('Cookie', userTwo).expect(200);

  // Make sure we only got orders for User #2
  // console.log('body',response.body);
  expect(response.body.length).toEqual(2);
  // console.log({ orderOne, orderTwo });
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[0].ticket.id).toEqual(orderOne.ticket.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[1].ticket.id).toEqual(orderTwo.ticket.id);

  // const ticketId = mongoose.Types.ObjectId();
  // await request(app)
  //   .post('/api/orders')
  //   .set('Cookie', global.signin())
  //   .send({ ticketId })
  //   .expect(404);
});

// it('returns an error if the ticket i already reserved', async () => {
//   const ticket = Ticket.build({
//     title: 'concert',
//     price: 20,
//   });

//   await ticket.save();

//   const order = Order.build({
//     ticket,
//     userId: 'dsfdsbdsfbfds',
//     status: OrderStatus.Created,
//     expiresAt: new Date(),
//   });

//   await order.save();

//   await request(app)
//     .post('/api/orders')
//     .set('Cookie', global.signin())
//     .send({ ticketId: ticket.id })
//     .expect(400);
// });

// it('reserves a ticket', async () => {
//   const ticket = Ticket.build({
//     title: 'concert',
//     price: 20,
//   });

//   await ticket.save();

//   await request(app)
//     .post('/api/orders')
//     .set('Cookie', global.signin())
//     .send({ ticketId: ticket.id })
//     .expect(201);
// });

// it.todo('emits an order created event');

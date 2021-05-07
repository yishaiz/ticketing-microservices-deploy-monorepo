import { sign } from 'jsonwebtoken';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

jest.mock('../../nats-wrapper');

it('has a route handler listening to /api/ticket for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app).post('/api/tickets').send({}).expect(401);
  // expect(response.status).toEqual(401)
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({});

  // console.log(response.status, global.signin())

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'sdnkldsnvlk',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'sdnkldsnvlk',
    })
    .expect(400);
});

it('create a ticket with valid inputs', async () => {
  // todo: add a check to make sure a ticket was saved

  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const ticketTile = 'svklnasvnlsd';
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: ticketTile,
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({});
  // console.log({tickets})

  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(ticketTile);
});

it('publishes an event', async () => {
  const ticketTile = 'dfdnbfkldaklvbkaj';

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: ticketTile,
      price: 20,
    })
    .expect(201);

  // console.log('debug!!!');
  // console.log(natsWrapper);
  // console.log(natsWrapper.client);
  // console.log(natsWrapper)
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

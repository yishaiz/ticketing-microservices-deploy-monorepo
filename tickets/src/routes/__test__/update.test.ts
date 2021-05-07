import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

// jest.mock('../../nats-wrapper')

const title = 'concert';
const price = 20;

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title,
      price,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  // const id = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title,
    price,
  });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'dfvdfb',
      price: 1000,
    })
    .expect(401);
});

it('returns a 400 if user provides an invalid title or price', async () => {
  const cookie = global.signin();
  const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title,
    price,
  });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin();

  const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title,
    price,
  });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(201);

  // can fetch the ticket and verify ...

  const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`);
  expect(ticketResponse.body.title).toEqual('new title');
  expect(ticketResponse.body.price).toEqual(100);
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

  // console.log(natsWrapper)
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects update if the ticket is reserved', async () => {
  const cookie = global.signin();

  const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: 'title',
    price: 20,
  });

  // lock the ticket
  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(400);
});

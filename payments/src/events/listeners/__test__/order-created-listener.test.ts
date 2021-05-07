import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@ticketing-microservices/common-new';
import { natsWrapper } from './../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import { Order } from '../../../models/order';
import mongoose from 'mongoose';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'alsdskl',
    expiredAt: 'ksdvhkdask',
    ticket: {
      id: 'dfnkdlfdf',
      price: 10,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  if (!order) {
    throw new Error('Order not found');
  }

  expect(order!.price).toEqual(data.ticket.price);
});

it('ack the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

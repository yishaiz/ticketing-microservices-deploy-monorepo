import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import {
  Subjects,
  Listener,
  ExpirationCompleteEvent,
  OrderStatus,
} from '@ticketing-microservices/common-new';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

import { Order } from '../../models/order';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;
  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    console.log('ExpirationCompleteListener - onMessage');

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.Complete) {
      console.log('order is already complete');
      msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
      // ticket: null,
    });

    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}

import { Message } from 'node-nats-streaming';
import { Listener, OrderCancelledEvent, Subjects } from '@ticketing-microservices/common-new';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    console.log('OrderCancelledListener - onMessage');

    // If no ticket - throw an error
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // UnMark the ticket as reserved by setting its orderId proerty
    ticket.set({ orderId: undefined });

    // Save the ticket
    await ticket.save();

    const { id, price, title, userId, orderId, version } = ticket;

    // await new TicketUpdatedPublisher(this.client).publish({

    new TicketUpdatedPublisher(this.client).publish({
      id,
      price,
      title,
      userId,
      orderId,
      version,
    });

    // ack the message
    msg.ack();
  }
}

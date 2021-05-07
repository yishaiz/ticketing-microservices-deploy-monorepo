import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@ticketing-microservices/common-new';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    console.log('OrderCreatedListener - onMessage');

    // If no ticket - throw an error
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Mark the ticket as reserved by setting its orderId proerty
    ticket.set({ orderId: data.id });

    // Save the ticket
    await ticket.save();
    // new TicketUpdatedPublisher(natsWrapper.client);

    const { id, price, title, userId, orderId, version } = ticket;

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

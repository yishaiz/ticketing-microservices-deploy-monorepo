import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Subjects, Listener, TicketCreatedEvent } from '@ticketing-microservices/common-new';
import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    console.log(' TicketCreatedListener received a messgae');

    // console.log({id, title, price})
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}

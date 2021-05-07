import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Subjects, Listener, TicketUpdatedEvent } from '@ticketing-microservices/common-new';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    console.log('TicketUpdatedListener');

    // const ticket = await Ticket.findById(id);

    // const ticket = await Ticket.findOne({
    //   _id: id,
    //   version: data.version - 1,
    // });

    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // const { id, title, price, version } = data;
    // ticket.set({ title, price, version });

    const { id, title, price } = data;
    ticket.set({ title, price });

    await ticket.save();

    msg.ack();
  }
}

import { Subjects, Publisher, TicketUpdatedEvent } from '@ticketing-microservices/common-new';
import { Stan } from 'node-nats-streaming';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  constructor(stan: Stan) {
    super(stan);
    console.log('ticket update publisher had been called');
  }
}

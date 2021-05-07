import { Subjects, Publisher, TicketCreatedEvent } from '@ticketing-microservices/common-new';

import { Stan } from 'node-nats-streaming';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;

  constructor(stan: Stan) {
    super(stan);
    console.log('create publisher had been called');
  }
}

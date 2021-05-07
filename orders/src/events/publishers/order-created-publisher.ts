import { Publisher, OrderCreatedEvent, Subjects } from '@ticketing-microservices/common-new';
import { Stan } from 'node-nats-streaming';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  // constructor(stan: Stan) {
  //   super(stan);
  // }
}

// new OrderCreatedPublisher(natsClient).publish({
//     id:
// })

import { Publisher, OrderCancelledEvent, Subjects } from '@ticketing-microservices/common-new';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

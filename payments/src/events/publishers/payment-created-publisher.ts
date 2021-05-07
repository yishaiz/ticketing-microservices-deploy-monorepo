import { Subjects, Publisher, PaymentCreatedEvent } from '@ticketing-microservices/common-new';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}

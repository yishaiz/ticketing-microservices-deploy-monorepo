import { Subjects, Publisher, ExpirationCompleteEvent } from '@ticketing-microservices/common-new';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}

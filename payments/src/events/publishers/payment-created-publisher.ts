import { PaymentCreatedEvent, Publisher, Subjects } from '@eatickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}

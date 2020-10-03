import { OrderCompletedEvent, Publisher, Subjects } from '@eatickets/common';

export class OrderCompletedPublisher extends Publisher<OrderCompletedEvent> {
  readonly subject = Subjects.OrderComplete;
}

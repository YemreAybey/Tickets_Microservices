import { Publisher, Subjects, OrderCancelledEvent } from '@eatickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}

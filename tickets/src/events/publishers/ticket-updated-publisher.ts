import { Publisher, Subjects, TicketUpdatedEvent } from '@eatickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

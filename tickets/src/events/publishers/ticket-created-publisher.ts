import { Publisher, TicketCreatedEvent, Subjects } from '@eatickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}

import { Listener, Subjects, TicketUpdatedEvent } from '@eatickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { title, price, id } = data;
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}

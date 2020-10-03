import { Listener, OrderCompletedEvent, Subjects } from '@eatickets/common';
import { Message } from 'node-nats-streaming';
import email from '../../mailer';
import { QUEUE_GROUP_NAME } from '../constants/queue-group-name';

export class OrderCompletedListener extends Listener<OrderCompletedEvent> {
  readonly subject = Subjects.OrderComplete;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCompletedEvent['data'], msg: Message) {
    try {
      await email.send({
        template: 'ticket-bought',
        message: {
          to: data.useremail,
        },
        locals: {
          name: data.useremail,
          event: data.ticket.title,
          price: data.ticket.price,
        },
      });
    } catch (error) {
      console.log(error);
    }

    msg.ack();
  }
}

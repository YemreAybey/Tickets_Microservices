import { Listener, OrderCreatedEvent, Subjects } from '@eatickets/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';
import { QUEUE_GROUP_NAME } from './que-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('waiting ', delay, ' miliseconds');
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}

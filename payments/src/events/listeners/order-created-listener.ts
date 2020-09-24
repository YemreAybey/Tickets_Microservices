import { Listener, OrderCreatedEvent, Subjects } from '@eatickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { QUEUE_GROUP_NAME } from './que-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });

    await order.save();

    msg.ack();
  }
}

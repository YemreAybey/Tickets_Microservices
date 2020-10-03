import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from '@eatickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { OrderCompletedPublisher } from '../publishers/order-completed-publisher';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Complete,
    });

     await order.save();

    await new OrderCompletedPublisher(this.client).publish({
      useremail: data.email,
      id: order.id,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
        title: order.ticket.title,
      },
    });

    msg.ack();
  }
}

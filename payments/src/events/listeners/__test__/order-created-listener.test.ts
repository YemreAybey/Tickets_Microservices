import { OrderCreatedEvent, OrderStatus } from '@eatickets/common';
import mongoose from 'mongoose';
import { Order } from '../../../models/order';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';

const setUp = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: 'asjhdkashkjd',
    ticket: {
      id: 'ajkshdkjh',
      price: 200,
    },
    status: OrderStatus.Created,
    expiresAt: 'askjdkashkd',
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('saves the order correctly', async () => {
  const { listener, data, msg } = await setUp();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setUp();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

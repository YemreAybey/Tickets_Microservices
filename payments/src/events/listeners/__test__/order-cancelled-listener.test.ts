import { OrderCancelledEvent, OrderStatus } from '@eatickets/common';
import mongoose from 'mongoose';
import { Order } from '../../../models/order';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setUp = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: 'adasd',
    version: 0,
  });

  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'alksjldakjs',
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it('updates the status of the order', async () => {
  const { listener, data, msg, order } = await setUp();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
  expect(updatedOrder?.version).toEqual(order.version + 1);
});

it('acks the message', async () => {
  const { listener, data, msg, order } = await setUp();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

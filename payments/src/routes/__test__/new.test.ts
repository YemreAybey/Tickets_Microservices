import { OrderStatus } from '@eatickets/common';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import { Order } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('can not be accessed if the user signed in', async () => {
  await request(app).post('/api/payments').send({}).expect(401);
});

it('can be accessed if the user signed in', async () => {
  const { cookie } = global.signin();

  const res = await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({});

  expect(res.status).not.toBe(401);
});

it('returns error if order does not exist', async () => {
  const { cookie } = global.signin();
  const orderId = mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({ token: 'ajskhdjkas', orderId: orderId })
    .expect(404);
});

it('returns error if user is not the orderer', async () => {
  const { cookie } = global.signin();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 200,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({ orderId: order.id, token: 'alsdjlaksjdk' })
    .expect(403);
});

it('returns error if the order is cancelled', async () => {
  const { cookie, id } = global.signin();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: id,
    version: 1,
    price: 200,
    status: OrderStatus.Cancelled,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({ orderId: order.id, token: 'alsdjlaksjdk' })
    .expect(400);
});

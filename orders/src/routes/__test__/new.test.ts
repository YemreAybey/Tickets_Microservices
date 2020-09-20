import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('can not be accessed if the user signed in', async () => {
  await request(app).post('/api/orders').send({}).expect(401);
});

it('can be accessed if the user signed in', async () => {
  const cookie = global.signin();

  const res = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({});

  expect(res.status).not.toBe(401);
});

it('returns error if ticket does not exist', async () => {
  const cookie = global.signin();
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId })
    .expect(404);
});

it('returns error if ticket is already reserved', async () => {
  const cookie = global.signin();

  const ticket = Ticket.build({
    title: 'concert',
    price: 40,
  });

  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves ticket', async () => {
  const cookie = global.signin();

  let orders = await Order.find({});

  expect(orders.length).toBe(0);

  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  orders = await Order.find({});

  expect(orders.length).toBe(1);
});

it('emits order created event', async () => {
  const cookie = global.signin();

  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

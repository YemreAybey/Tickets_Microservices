import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
// import { natsWrapper } from '../../nats-wrapper';

const buildTicket = async (num: number) => {
  const ticket = Ticket.build({
    title: 'first',
    price: num,
  });

  await ticket.save();

  return ticket;
};

it('shows the order for the user', async () => {
  const ticket = await buildTicket(30);
  const cookie = global.signin();

  const order = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  const res = await request(app)
    .get(`/api/orders/${order.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(res.body.id).toEqual(order.body.id);
});

it("doesn't allow another user to fetch the order", async () => {
  const ticket = await buildTicket(30);
  const cookie = global.signin();
  const cookie2 = global.signin();

  const order = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.body.id}`)
    .set('Cookie', cookie2)
    .send()
    .expect(403);
});

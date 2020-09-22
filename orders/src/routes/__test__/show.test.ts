import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import { Ticket } from '../../models/ticket';

const buildTicket = async (num: number) => {
  const ticket = Ticket.build({
    title: 'first',
    price: num,
    id: mongoose.Types.ObjectId().toHexString(),
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

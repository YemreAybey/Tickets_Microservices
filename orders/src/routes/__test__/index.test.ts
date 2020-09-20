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

it('can not be accessed if the user is not signed in', async () => {
  await request(app).get('/api/orders').send().expect(401);
});

it('fetches orders for a particular user', async () => {
  const ticket1 = await buildTicket(30);
  const ticket2 = await buildTicket(40);
  const ticket3 = await buildTicket(50);

  const cookie1 = global.signin();
  const cookie2 = global.signin();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie2)
    .send({ ticketId: ticket2.id })
    .expect(201);

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie2)
    .send({ ticketId: ticket3.id })
    .expect(201);

  const res1 = await request(app)
    .get('/api/orders')
    .set('Cookie', cookie1)
    .send()
    .expect(200);

  const res2 = await request(app)
    .get('/api/orders')
    .set('Cookie', cookie2)
    .send()
    .expect(200);

  expect(res1.body.length).toEqual(1);
  expect(res2.body.length).toEqual(2);
  expect(res1.body[0].ticket.price).toEqual(30);
});

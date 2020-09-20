import request from 'supertest';
import app from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post req', async () => {
  const res = await request(app).post('/api/tickets').send({});

  expect(res.status).not.toBe(404);
});

it('can not be accessed if the user signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('can be accessed if the user signed in', async () => {
  const cookie = global.signin();

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({});

  expect(res.status).not.toBe(401);
});

it('returns error with invalid title', async () => {
  const cookie = global.signin();

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: '', price: '22.50' })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ price: '22.50' })
    .expect(400);
});

it('returns error with invalid price', async () => {
  const cookie = global.signin();

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Test' })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Test', price: -10 })
    .expect(400);
});

it('creates ticket with valid credentials', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const cookie = global.signin();

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'test', price: 22.5 })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toBe('test');
});

it('publishes an event', async () => {
  const cookie = global.signin();

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'yemre', price: 40 })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

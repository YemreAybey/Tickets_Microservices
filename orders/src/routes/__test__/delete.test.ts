import request from 'supertest';
import app from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

const buildTicket = async (num: number) => {
  const ticket = Ticket.build({
    title: 'first',
    price: num,
  });

  await ticket.save();

  return ticket;
};

it('owner can cancel the order', async () => {
  const ticket = await buildTicket(30);
  const cookie = global.signin();

  const order = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(order.body.status).toEqual(OrderStatus.Created);

  const res = await request(app)
    .delete(`/api/orders/${order.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.body.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("doesn't allow another user to cancel the order", async () => {
  const ticket = await buildTicket(30);
  const cookie = global.signin();
  const cookie2 = global.signin();

  const order = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.body.id}`)
    .set('Cookie', cookie2)
    .send()
    .expect(403);
});

it('Emits an order cancelled event', async () => {
  const cookie = global.signin();

  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

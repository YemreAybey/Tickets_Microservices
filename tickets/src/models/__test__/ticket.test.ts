import request from 'supertest';
import app from '../../app';
import { Ticket } from '../../models/ticket';

it('does correct versioning', async () => {
  const cookie = global.signin();

  const ticket = Ticket.build({
    title: 'concert',
    price: 22.5,
    userId: '123',
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await firstInstance?.save();

  expect(secondInstance?.save).toThrow();
});

it('increments version', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 22.5,
    userId: '123',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});

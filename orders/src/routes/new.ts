import express, { Request, Response } from 'express';
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from '@eatickets/common';
import { body } from 'express-validator';
import { validateRequest } from '@eatickets/common';
import { Order } from '../models/order';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .notEmpty({ ignore_whitespace: true })
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided and valid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError('The ticket is already reserved');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      userId: order.userId,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };

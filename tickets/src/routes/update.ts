import express, { Request, Response } from 'express';
import {
  NotFoundError,
  requireAuth,
  ForbiddenRequestError,
} from '@eatickets/common';
import { body } from 'express-validator';
import { validateRequest } from '@eatickets/common';

import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title')
      .trim()
      .notEmpty({ ignore_whitespace: true })
      .withMessage('You must provide a title')
      .isLength({ min: 3 }),

    body('price')
      .trim()
      .notEmpty({ ignore_whitespace: true })
      .withMessage('You must provide a price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than zero'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new ForbiddenRequestError();
    }

    const { title, price } = req.body;

    ticket.set({
      title,
      price,
    });

    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };

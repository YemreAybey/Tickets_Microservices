import express, { Request, Response } from 'express';
import { requireAuth } from '@eatickets/common';
import { body } from 'express-validator';
import { validateRequest } from '@eatickets/common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/tickets',
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
    const { title, price } = req.body;
    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
    await ticket.save();
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });
    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };

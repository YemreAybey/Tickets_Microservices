import express, { Request, Response } from 'express';
import {
  BadRequestError,
  ForbiddenRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from '@eatickets/common';
import { body } from 'express-validator';
import { validateRequest } from '@eatickets/common';
import { Order } from '../models/order';
import mongoose from 'mongoose';
import { natsWrapper } from '../nats-wrapper';
import { stripe } from '../stripe';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token').notEmpty({ ignore_whitespace: true }),
    body('orderId').notEmpty({ ignore_whitespace: true }),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
      throw new ForbiddenRequestError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Can not pay for expired order');
    }

    await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    res.send({ success: true });
  }
);

export { router as createChargeRouter };

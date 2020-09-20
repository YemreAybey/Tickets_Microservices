import {
  ForbiddenRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@eatickets/common';
import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import mongoose from 'mongoose';
import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  [
    param('orderId').custom((input: string) =>
      mongoose.Types.ObjectId.isValid(input)
    ),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new ForbiddenRequestError();
    }

    res.send(order);
  }
);

export { router as showOrderRouter };

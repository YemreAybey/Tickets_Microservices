import mongoose from 'mongoose';
import { OrderStatus } from '@eatickets/common';
import { TicketDoc } from './ticket';

interface OrderAttrs {
  ticket: TicketDoc;
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
}

interface OrderDoc extends mongoose.Document {
  ticket: TicketDoc;
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

OrderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema);

export { Order, OrderStatus };

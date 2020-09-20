import { Order, OrderStatus } from './order';
import mongoose from 'mongoose';
import { BadRequestError } from '@eatickets/common';

interface TicketAttrs {
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

ticketSchema.methods.isReserved = async function () {
  const exisitngOrder = await Order.findOne({
    ticket: this,
    status: {
      $ne: OrderStatus.Cancelled,
    },
  });

  return !!exisitngOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };

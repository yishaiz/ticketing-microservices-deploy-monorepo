import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  requireAuth,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from '@ticketing-microservices/common-new';

import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

// todo: return to 15 minutes
// const EXPIRATION_WINDOW_SECONDS = 15 * 60;
const EXPIRATION_WINDOW_SECONDS = 1 * 60;
// const EXPIRATION_WINDOW_SECONDS = 1 * 20;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided'),
  ],
  async (req: Request, res: Response) => {
    const ticketId = req.body.ticketId;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();

    // console.log({ isReserved });

    if (isReserved) {
      throw new BadRequestError('Ticket is already reservedI');
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

    // publish an event - order was created
    // console.log('debug 1!!!')
    // console.log(natsWrapper)
    // console.log(natsWrapper.client)

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      version: order.version,
      expiredAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };

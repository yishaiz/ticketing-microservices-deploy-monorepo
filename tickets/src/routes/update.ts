import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
  NotFoundError,
  NotAuthorizedError,
  requireAuth,
  validateRequest,
  BadRequestError,
} from '@ticketing-microservices/common-new';

import { Ticket } from '../models/ticket';
// import { TicketUpdatedPublisher } from './../events/publishers/ticket-updated-publisher';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from './../nats-wrapper';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price mus be provided and must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket');
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // ticket.set({
    //   title: req.body.title,
    //   price: req.body.price,
    // })

    const { title, price } = req.body;

    ticket.set({
      title,
      price,
    });

    await ticket.save();

    // console.log("going to publish update event !!!!!!!!")

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  }
);

export { router as updateTicketRouter };

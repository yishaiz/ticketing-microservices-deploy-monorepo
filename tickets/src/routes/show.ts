// import { NotFoundError } from './../../../common-new/src/errors/not-found-error';
import { NotFoundError } from '@ticketing-microservices/common-new';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

// import {
//   requireAuth,
//   validateRequest,
// } from '@ticketing-microservices/common-new';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    //  return res.sendStatus(404);
    throw new NotFoundError();
  }

  res.send(ticket); // default is 200
});

export { router as showTicketRouter };

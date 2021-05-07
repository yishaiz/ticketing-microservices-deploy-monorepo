import express, { Request, Response } from 'express';
import { requireAuth } from '@ticketing-microservices/common-new';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket');

  // console.log({ orders });
  // console.log('debug', req.currentUser, req.currentUser!.id);
  // console.log('debug 2 ', req.currentUser!.id.toString());

  // const debugOrders = await Order.find({});
  // console.log({ debugOrders });

  res.send(orders);
});

export { router as indexOrderRouter };

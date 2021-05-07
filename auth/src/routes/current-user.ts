import express from 'express';
// import jwt from 'jsonwebtoken';
// import { currentUser } from '../middlewares/current-user';
import { currentUser } from '@ticketing-microservices/common-new';
// import { requireAuth } from '../middlewares/require-auth';

const router = express.Router();

// router.get('/api/users/currentuser', currentUser, requireAuth, (req, res) => {
router.get('/api/users/currentuser', currentUser, (req, res) => {
  // res.send({ currentUser: req.currentUser || {name:'yishai'} });

  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };

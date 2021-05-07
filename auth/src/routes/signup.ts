import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError, CustomError } from '@ticketing-microservices/common-new';

import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // console.log('pass validation');

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // console.log('email in use', existingUser);
      // return res.send({});
      throw new BadRequestError('Email in use');
    }

    // console.log('Creating a user ...');

    const user = User.build({ email, password });
    await user.save();

    // generate jwt
    const secretKey = process.env.JWT_KEY!;
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      secretKey
    );

    // store it in object
    // req.session.jwt = userJwt;

    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signUpRouter };

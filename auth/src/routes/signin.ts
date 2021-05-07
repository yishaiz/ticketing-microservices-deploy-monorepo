import express, { Request, Response } from 'express';
// import { body, validationResult } from 'express-validator';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@ticketing-microservices/common-new';
import { User } from '../models/user';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    // console.log({ existingUser });

    if (!existingUser) {
      // console.log('user doesn\'t exist')
      throw new BadRequestError('Invalid credentials (1)');
    }

    // console.log('Password.compare', existingUser.password,password)

    const passwordMatch = await Password.compare(existingUser.password, password);

    if (!passwordMatch) {
      // console.log('password does\'t match')
      throw new BadRequestError('Invalid credentials (2)');
    }

    // authenticated. generate jwt

    // generate jwt
    const secretKey = process.env.JWT_KEY!;
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      secretKey
    );

    // store it in object
    // req.session.jwt = userJwt;

    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signInRouter };

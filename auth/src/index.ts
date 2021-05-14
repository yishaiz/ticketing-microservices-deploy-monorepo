import mongoose from 'mongoose';

import { app } from './app';

// *** test npm package
// import {Greeter} from "@ticketing-microservices/common-new"
// Greeter("test")

const start = async () => {

  console.log('auth service starting ...')

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    // debug local
    // await mongoose.connect('mongodb://localhost:27017/auth', {

    // k8s
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('connected to mongo DB');
  } catch (err) {
    console.error({ mongo: 'error when trying toconnect', err });
  }
};

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port} !`);
});

start();

import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

interface Payload {
  orderId: string;
}

const queueName = 'order:expiration';

const expirationQueue = new Queue<Payload>(queueName, {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  console.log('I want to publish an expiration:complete event for the orderId', job.data.orderId);

  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });

  // console.log({ job });
});

export { expirationQueue };

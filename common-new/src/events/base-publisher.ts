import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  // private client: Stan;
  protected client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T['data']): Promise<void> {
    console.log('publish event');
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        console.log({ debug: 'publish', data, err });
        if (err) {
          console.error(err);
          return reject(err);
        }
        console.log(data);
        resolve();
      });
    });
  }
}

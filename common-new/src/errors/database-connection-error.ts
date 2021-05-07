import { CustomError } from './custom-error';

// export class DatabaseConnectionError extends Error {
export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = 'Error connection to database';

  constructor() {
    super('Invalid request parameters');

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
  serializeErrors() {
    return [
      {
        // error: this.reason
        message: this.reason,
      },
    ];
  }
}

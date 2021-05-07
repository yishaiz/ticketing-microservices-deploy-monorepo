export enum OrderStatus {
  // when the order has been created, but the ticket it is trying to order has not been created
  Created = 'created',

  // The ticket the order is trying to reserve has already been reserved, or when the use has cacelled the order.
  // Also, when the order expires before payment
  Cancelled = 'cancelled',

  // The order has successfully reserved the ticket
  AwaitingPayemnt = 'awaiting:payemnt',

  // The order has successfully reserved the ticket and the user provided payment successfully
  Complete = 'complete',
}

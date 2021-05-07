import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';

import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderIs: order.id,
    },
    onSuccess: (payment) => Router.push('/orders'),
  });

  useEffect(() => {
    console.count('recreate');
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
      console.log('calculate timer');

      if (msLeft <= 0) {
        clearInterval(timerId);
      }
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft <= 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      Time left to pay : {timeLeft} seconds
      <StripeCheckout
        // token={token => {
        token={({ id }) => {
          console.log(id);
          // useRequest hook ...
        }}
        stripeKey='pk_test_51IeKrYBTRNCrn0N1bkO84V9HTtELEpUdsTd3LcMMsDbjuGGfCPAIt5Bro7wd4gWkzxA0L1rAMZNYjDoWrqMaeSHg00E5aPYDol'
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  console.log({ orderId });
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;

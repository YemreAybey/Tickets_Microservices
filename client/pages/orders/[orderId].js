import useRequest from '../../hooks/use-request';
import { useToasts } from 'react-toast-notifications';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';

const TicketShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const { addToast } = useToasts();

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();

    const timerId = setInterval(findTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (typeof timeLeft === 'number' && timeLeft <= 0) {
      addToast('Order Expired', {
        appearance: 'warning',
        autoDismiss: true,
      });
      Router.push('/');
    }
  }, [timeLeft]);

  const [doRequest] = useRequest({
    url: '/api/payments',
    method: 'post',
    onSuccess: () => {
      addToast('Ticket Bought', {
        appearance: 'success',
        autoDismiss: true,
      });
      Router.push('/orders');
    },
  });

  return (
    <div>
      <h1>Time left to pay: {timeLeft} seconds</h1>
      <h4>Price: {order.ticket.price}</h4>
      <StripeCheckout
        token={({ id }) => doRequest({ orderId: order.id, token: id })}
        stripeKey='pk_test_51HUx7dL5JwnZbOxk23tpGGfqQpS3E5OX8xOEodtOiCqlGwFvv0GrmruEfEz0PJyM8wDcgMuqEO1dbogawGpSJxDQ00zuLQTbHb'
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </div>
  );
};

TicketShow.getInitialProps = async (context, req) => {
  const { orderId } = context.query;

  const { data } = await req.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default TicketShow;

import useRequest from '../../hooks/use-request';
import { useToasts } from 'react-toast-notifications';
import Router from 'next/router';

const TicketShow = ({ ticket }) => {
  const { addToast } = useToasts();

  const [doRequest] = useRequest({
    url: '/api/orders',
    method: 'post',
    onSuccess: order => {
      addToast('Order Created', {
        appearance: 'success',
        autoDismiss: true,
      });
      Router.push(`/orders/${order.id}`);
    },
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      <button
        className='btn btn-primary'
        onClick={() =>
          doRequest({
            ticketId: ticket.id,
          })
        }>
        Purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, req) => {
  const { ticketId } = context.query;

  const { data } = await req.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;

const Orders = ({ orders }) => {
  const renderOrders = () => {
    return orders.map(order => {
      return (
        <ul key={order.id}>
          <li>
            {' '}
            {order.ticket.title} - {order.status}{' '}
          </li>
        </ul>
      );
    });
  };

  return renderOrders();
};

Orders.getInitialProps = async (context, req) => {
  const { data } = await req.get('/api/orders');

  return { orders: data };
};

export default Orders;

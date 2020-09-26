import Link from 'next/link';

const Index = ({ currentUser, tickets }) => {
  const renderTickets = () => {
    return tickets.map(ticket => {
      return (
        <tr key={ticket.id}>
          <td>{ticket.title}</td>
          <td>{ticket.price}</td>
          <td>
            <Link href={`/tickets/[ticketId]`} as={`/tickets/${ticket.id}`}>
              <a>Go To Ticket</a>
            </Link>
          </td>
        </tr>
      );
    });
  };

  return (
    <div>
      <h1>Tickets</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>See Ticket</th>
          </tr>
        </thead>
        <tbody>{renderTickets()}</tbody>
      </table>
    </div>
  );
};

Index.getInitialProps = async (context, req, currentUser) => {
  const { data } = await req.get('/api/tickets');
  return { tickets: data };
};

export default Index;

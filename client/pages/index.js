import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  console.log({ tickets });

  const ticketsList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href={'/tickets/[ticketId]'} as={`/tickets/${ticket.id}`}>
            <a className='btn btn-primary'>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  // <a className='btn btn-primary' href={ticket.price}'

  return (
    <div>
      {/* <h1>Landing Page</h1>
      <h1>{currentUser ? 'You are signed in' : 'You are NOT signed in'}</h1> */}
      <h1>Tickets</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketsList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default LandingPage;

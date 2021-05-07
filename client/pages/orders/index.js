const OrderIndex = ({ orders }) => {
    const ordersList = orders.map(order => {
        return (
            <li key={order.id}>
                {order.ticket.title} - {order.status}
            </li>
        )
    })
    return (
        <ul>{ordersList}</ul>   
    )
}

OrderIndex.geInitialProps = async (context, client) => {
    const { data } = await client.get('/api/orders')

    return { orders: data }
}
export default OrderIndex
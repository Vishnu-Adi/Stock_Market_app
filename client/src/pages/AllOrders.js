import React, { useEffect, useState } from "react";
// Remove unused imports
// import "../styles/AllOrders.css";
// import { Container, Typography } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';

const AllOrders = () => {

  
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    await axios.get("http://localhost:6001/fetch-orders")
      .then((response) => {
        setOrders(response.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const columns = [
    { field: 'user', headerName: 'User ID', width: 200 },
    { field: 'stockType', headerName: 'Order Type', width: 200 },
    { field: 'name', headerName: 'Stock Name', width: 200 },
    { field: 'symbol', headerName: 'Symbol', width: 200 },
    { field: 'orderType', headerName: 'Order Type', width: 200 },
    { field: 'count', headerName: 'Stocks', width: 200 },
    { field: 'price', headerName: 'Order Price', width: 200 },
    { field: 'totalPrice', headerName: 'Order Total Value', width: 200 },
    { field: 'orderStatus', headerName: 'Order Status', width: 200 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">All Orders</h1>
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4">User ID</th>
            <th className="py-2 px-4">Order Type</th>
            <th className="py-2 px-4">Stock Name</th>
            <th className="py-2 px-4">Symbol</th>
            <th className="py-2 px-4">Order Type</th>
            <th className="py-2 px-4">Stocks</th>
            <th className="py-2 px-4">Order Price</th>
            <th className="py-2 px-4">Order Total Value</th>
            <th className="py-2 px-4">Order Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td className="border-t py-2 px-4">{order.user}</td>
              <td className="border-t py-2 px-4">{order.stockType}</td>
              <td className="border-t py-2 px-4">{order.name}</td>
              <td className="border-t py-2 px-4">{order.symbol}</td>
              <td className="border-t py-2 px-4">{order.orderType}</td>
              <td className="border-t py-2 px-4">{order.count}</td>
              <td className="border-t py-2 px-4">{order.price}</td>
              <td className="border-t py-2 px-4">{order.totalPrice}</td>
              <td className="border-t py-2 px-4">{order.orderStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllOrders;

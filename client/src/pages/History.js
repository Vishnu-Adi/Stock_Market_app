import React, { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
  const [orders, setOrders] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    await axios
      .get("http://localhost:6001/fetch-orders")
      .then((response) => {
        setOrders(response.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">My Orders</h1>
      <div className="grid gap-6">
        {orders
          .filter((order) => order.user === userId)
          .map((order) => (
            <div key={order._id} className="bg-white shadow-md rounded-lg p-6">
              <div className="user-history-stock">
                <h6 className="text-gray-500">{order.stockType}</h6>
                <div className="mt-4">
                  <p><strong>Stock:</strong> {order.name}</p>
                  <p><strong>Symbol:</strong> {order.symbol}</p>
                  <p><strong>Order:</strong> {order.orderType}</p>
                  <p><strong>Stocks Bought:</strong> {order.count}</p>
                  <p><strong>Price:</strong> $ {order.price}</p>
                  <p><strong>Value:</strong> $ {order.totalPrice}</p>
                  <p><strong>Status:</strong> <span className="text-green-500">{order.orderStatus}</span></p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default History;

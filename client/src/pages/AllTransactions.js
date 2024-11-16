import React, { useEffect, useState } from 'react';
// Remove unused imports
// import '../styles/AllTransactions.css';
// import { Container, Typography } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';

const AllTransactions = () => {

  const [transactions, setTransactions] = useState([]);

  useEffect(()=>{
    fetchTransactions();
  }, [])

  const fetchTransactions = async()=>{
    await axios.get('http://localhost:6001/transactions').then(
      (response)=>{
        setTransactions(response.data.reverse());
      }
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">All Transactions</h1>
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4">Transaction ID</th>
            <th className="py-2 px-4">User ID</th>
            <th className="py-2 px-4">Amount</th>
            <th className="py-2 px-4">Action</th>
            <th className="py-2 px-4">Payment Mode</th>
            <th className="py-2 px-4">Time</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction._id}>
              <td className="border-t py-2 px-4">{transaction._id}</td>
              <td className="border-t py-2 px-4">{transaction.user}</td>
              <td className="border-t py-2 px-4">{transaction.amount}</td>
              <td className="border-t py-2 px-4">{transaction.type}</td>
              <td className="border-t py-2 px-4">{transaction.paymentMode}</td>
              <td className="border-t py-2 px-4">{transaction.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllTransactions;
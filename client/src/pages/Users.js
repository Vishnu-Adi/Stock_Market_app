import React, { useEffect, useState } from 'react';
// Remove unused imports
// import '../styles/Users.css';
// import { Container, Grid, Paper, Typography } from '@mui/material';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    await axios.get("http://localhost:6001/fetch-users").then(
      (response) => {
        setUsers(response.data);
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">All Users</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.filter(user => user.usertype !== 'admin').map((user) => (
          <div key={user._id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{user.username}</h2>
            <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
            <p className="text-gray-700"><strong>Balance:</strong> ${user.balance}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
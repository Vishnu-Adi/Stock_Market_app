// client/src/pages/Register.jsx
import React from 'react';
import { useContext } from 'react';
import { GeneralContext } from '../context/GeneralContext';

const Register = () => {
  const { username, setUsername, email, setEmail, password, setPassword, usertype, setUsertype, register } = useContext(GeneralContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register();
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none"
          required
        />
        <select
          value={usertype || 'customer'}
          onChange={(e) => setUsertype(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none"
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded mt-4"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
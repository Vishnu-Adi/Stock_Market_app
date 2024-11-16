import React, { useContext } from 'react';
import { GeneralContext } from '../context/GeneralContext';

const Login = ({ setIsLoginBox }) => {
  const { setEmail, setPassword, login } = useContext(GeneralContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login();
  };

  return (
    <form className="authForm" onSubmit={handleLogin}>
      <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>
      <input
        type="email"
        placeholder="Email Address"
        className="w-full p-2 border border-gray-300 rounded mt-2"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border border-gray-300 rounded mt-2"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">
        Sign In
      </button>
      <p className="mt-4">
        New to Growth Equity?{' '}
        <button className="text-blue-500" onClick={() => setIsLoginBox(false)}>
          Create an account
        </button>
      </p>
    </form>
  );
};

export default Login;
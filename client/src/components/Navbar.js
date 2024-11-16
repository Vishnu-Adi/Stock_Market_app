import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext';

const Navbar = () => {
  const navigate = useNavigate();
  const usertype = localStorage.getItem('userType');
  const {logout} = useContext(GeneralContext);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>
          Growth Equity
        </div>
        <div className="flex space-x-4">
          {!usertype ? (
            <>
              <button onClick={() => navigate('/')}>Home</button>
              <button onClick={() => navigate('/about')}>About</button>
              <button onClick={() => navigate('/register')} className="border px-4 py-2 rounded">
                Join now
              </button>
            </>
          ) : usertype === 'customer' ? (
            <>
              <button onClick={() => navigate('/home')}>Home</button>
              <button onClick={() => navigate('/portfolio')}>Portfolio</button>
              <button onClick={() => navigate('/history')}>History</button>
              <button onClick={() => navigate('/profile')}>Profile</button>
              <button onClick={logout}>Logout</button>
            </>
          ) : usertype === 'admin' ? (
            <>
              <button onClick={() => navigate('/admin')}>Dashboard</button>
              <button onClick={() => navigate('/users')}>Users</button>
              <button onClick={() => navigate('/all-orders')}>Orders</button>
              <button onClick={() => navigate('/all-transactions')}>Transactions</button>
              <button onClick={logout}>Logout</button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
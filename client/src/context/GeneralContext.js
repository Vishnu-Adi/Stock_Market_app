// client/src/context/GeneralContext.js
import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const GeneralContext = createContext();

const GeneralContextProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('customer');
  const navigate = useNavigate();

  const API_URL = 'http://localhost:6001';

  const register = async () => {
    try {
      if (!username || !email || !password) {
        alert('All fields are required');
        return;
      }

      const inputs = { username, email, usertype, password };
      const response = await axios.post(`${API_URL}/register`, inputs);
      
      if (response.data) {
        localStorage.setItem('userId', response.data._id);
        localStorage.setItem('userType', response.data.usertype);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('balance', response.data.balance);

        setUsername('');
        setEmail('');
        setPassword('');
        setUsertype('customer');

        if (response.data.usertype === 'customer') {
          navigate('/home');
        } else if (response.data.usertype === 'admin') {
          navigate('/admin');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  const login = async () => {
    try {
      if (!email || !password) {
        alert('Email and password are required');
        return;
      }

      const response = await axios.post(`${API_URL}/login`, { email, password });
      
      if (response.data) {
        localStorage.setItem('userId', response.data._id);
        localStorage.setItem('userType', response.data.usertype);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('balance', response.data.balance);

        setEmail('');
        setPassword('');

        if (response.data.usertype === 'customer') {
          navigate('/home');
        } else if (response.data.usertype === 'admin') {
          navigate('/admin');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <GeneralContext.Provider 
      value={{
        login,
        register,
        logout,
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        usertype,
        setUsertype
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;
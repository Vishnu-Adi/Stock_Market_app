import React, { useState } from 'react';
// Remove unused imports
// import '../styles/Landing.css';
// import { Container, Grid, Paper, Typography, Box } from '@mui/material';
// import { styled } from '@mui/material/styles';
import Login from '../components/Login';
import Register from '../components/Register';

const Landing = () => {
  const [isLoginBox, setIsLoginBox] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-white mb-8 md:mb-0">
          <h1 className="text-5xl font-bold mb-4">Trade Smarter with Growth Equity</h1>
          <p className="text-xl">Your journey to successful trading starts here</p>
        </div>
        <div className="md:w-1/2 bg-white bg-opacity-80 p-8 rounded-lg">
          {isLoginBox ? (
            <Login setIsLoginBox={setIsLoginBox} />
          ) : (
            <Register setIsLoginBox={setIsLoginBox} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Landing from './pages/Landing';
import LoginProtector from './Route/AuthProtector';
import AuthProtector from './Route/LoginProtector';
import Portfolio from './pages/Portfolio';
import History from './pages/History';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import StockChart from './pages/StockChart';
import Users from './pages/Users'
import AllOrders from './pages/AllOrders'
import AllTransactions from './pages/AllTransactions'


function App() {


  return (

    <div className="App">

      
        <Navbar />
        <Routes>
          <Route exact path='' element={<LoginProtector> <Landing /> </LoginProtector> } />
          <Route  path='/home' element={<AuthProtector><Home /></AuthProtector>} />
          <Route  path='/portfolio' element={<AuthProtector><Portfolio /></AuthProtector>} />
          <Route  path='/history' element={<AuthProtector><History /></AuthProtector>} />
          <Route  path='/profile' element={<AuthProtector><Profile /></AuthProtector>} />
          <Route  path='/stock/:id' element={<AuthProtector><StockChart /></AuthProtector>} />
          <Route  path='/users' element={ <AuthProtector><Users /></AuthProtector>} />
          <Route  path='/all-orders' element={ <AuthProtector><AllOrders /></AuthProtector>} />
          <Route  path='/all-transactions' element={ <AuthProtector><AllTransactions /></AuthProtector>} />

        </Routes>
      

      
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react'
import { Container, Paper, Typography, Button, TextField, Select, MenuItem, Box, Grid, Card, CardContent, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import {RiRefund2Line, RiHistoryLine} from 'react-icons/ri'
import {GiCash} from 'react-icons/gi'
import axios from 'axios';

const ProfileCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const TransactionCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Profile = () => {

  const [actionType, setActionType] = useState('Transactions');
  const [userData, setUserData] = useState([]);
  

 const userId = localStorage.getItem('userId');
 const username = localStorage.getItem('username');


 useEffect(()=>{
  fetchUser();
 },[])

 const fetchUser = async() =>{
  await axios.get(`http://localhost:6001/fetch-user/${userId}`).then(
    (response)=>{
      setUserData(response.data);
    }
  ).catch((err)=>{
    console.log(err);
  })
 }


  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [depositMode, setDepositMode] = useState('');
  const [withdrawMode, setWithdrawMode] = useState('');

  const [transactions, setTransactions] = useState([]);


  const deposit = async (e)=>{
    e.preventDefault();
    await axios.post('http://localhost:6001/deposit', {user: userId, depositAmount, depositMode}).then(
      (response)=>{
        localStorage.setItem('balance', response.data.balance);
        fetchTransactions();
        setActionType('Transactions');
        setDepositAmount(0);
        setDepositMode('');
      }
    ).catch((err)=>{
      alert('Transaction failed!!');
    })
  }


  const withdraw = async (e)=>{
    e.preventDefault();
      await axios.post('http://localhost:6001/withdraw', {user: userId, withdrawAmount, withdrawMode}).then(
        (response)=>{
          localStorage.setItem('balance', response.data.balance);
          fetchTransactions();
          setActionType('Transactions');
          setWithdrawAmount(0);
          setWithdrawMode('');
        }
      ).catch((err)=>{
        alert('Transaction failed!!');
      })
  }


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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>My Account</Typography>
      
      <ProfileCard>
        <Typography variant="h5" gutterBottom>{username}</Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1">Trading Balance</Typography>
          <Typography variant="h4" color="primary">${userData.balance}</Typography>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item>
            <ActionButton
              variant={actionType === 'AddFunds' ? 'contained' : 'outlined'}
              onClick={() => setActionType('AddFunds')}
              startIcon={<RiRefund2Line />}
            >
              Add Funds
            </ActionButton>
          </Grid>
          <Grid item>
            <ActionButton
              variant={actionType === 'Withdraw' ? 'contained' : 'outlined'}
              onClick={() => setActionType('Withdraw')}
              startIcon={<GiCash />}
            >
              Withdraw
            </ActionButton>
          </Grid>
          <Grid item>
            <ActionButton
              variant={actionType === 'Transactions' ? 'contained' : 'outlined'}
              onClick={() => setActionType('Transactions')}
              startIcon={<RiHistoryLine />}
            >
              Transaction History
            </ActionButton>
          </Grid>
        </Grid>
      </ProfileCard>

      {actionType === 'AddFunds' && (
        <ProfileCard>
          <Typography variant="h5" gutterBottom>Add Funds</Typography>
          <form onSubmit={deposit}>
            <TextField
              label="Amount"
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Payment Mode</InputLabel>
              <Select
                value={depositMode}
                onChange={(e) => setDepositMode(e.target.value)}
                label="Payment Mode"
              >
                <MenuItem value="upi">UPI Payment</MenuItem>
                <MenuItem value="net banking">Net Banking</MenuItem>
                <MenuItem value="card">Credit/Debit Card</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Proceed
            </Button>
          </form>
        </ProfileCard>
      )}

      {actionType === 'Withdraw' && (
        <ProfileCard>
          <Typography variant="h5" gutterBottom>Withdraw</Typography>
          <form onSubmit={withdraw}>
            <TextField
              label="Amount"
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Withdraw Mode</InputLabel>
              <Select
                value={withdrawMode}
                onChange={(e) => setWithdrawMode(e.target.value)}
                label="Withdraw Mode"
              >
                <MenuItem value="upi">UPI Payment</MenuItem>
                <MenuItem value="NEFT">NEFT</MenuItem>
                <MenuItem value="IMPS">IMPS</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Proceed
            </Button>
          </form>
        </ProfileCard>
      )}

      {actionType === 'Transactions' && (
        <ProfileCard>
          <Typography variant="h5" gutterBottom>Transactions</Typography>
          {transactions
            .filter(transaction => transaction.user === userId)
            .map((transaction) => (
              <TransactionCard key={transaction.time}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <Typography variant="subtitle2">Amount</Typography>
                      <Typography variant="body1">${transaction.amount}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle2">Action</Typography>
                      <Typography variant="body1">{transaction.type}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle2">Payment Mode</Typography>
                      <Typography variant="body1">{transaction.paymentMode}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle2">Time</Typography>
                      <Typography variant="body1">{transaction.time.slice(0,24)}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </TransactionCard>
            ))}
        </ProfileCard>
      )}
    </Container>
  )
}

export default Profile